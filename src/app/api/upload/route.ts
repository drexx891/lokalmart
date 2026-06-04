import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "Tidak ada file yang diunggah" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const target = formData.get("target") as string || "avatar";
        
        // Buat folder uploads jika belum ada
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Generate nama file unik
        const ext = file.name.split('.').pop();
        const prefix = target === "store-logo" ? "logo" : "avatar";
        const fileName = `${prefix}-${user.id}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);

        // Tulis file ke direktori public
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;

        // Simpan URL ke database berdasarkan target
        try {
            if (target === "store-logo") {
                // Simpan ke Supplier.logoUrl
                await (prisma as any).supplier.update({
                    where: { userId: user.id },
                    data: { logoUrl: fileUrl }
                });
            } else {
                // Simpan ke User.avatarUrl
                await (prisma as any).user.update({
                    where: { id: user.id },
                    data: { avatarUrl: fileUrl }
                });
            }
        } catch (dbError: any) {
            console.warn("Prisma caching issue, file saved locally:", dbError.message);
        }

        // Wajib me-refresh cache Next.js
        revalidatePath("/profil", "layout");
        revalidatePath("/admin/pengaturan", "layout");

        return NextResponse.json({ 
            success: true, 
            message: target === "store-logo" ? "Logo toko berhasil diperbarui" : "Foto profil berhasil diperbarui",
            url: fileUrl 
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: error.message || "Gagal mengunggah foto" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Ambil data user saat ini untuk mengecek apakah ada file yang bisa dihapus dari lokal
        const dbUser = await (prisma as any).user.findUnique({
            where: { id: user.id }
        });

        if (dbUser?.avatarUrl) {
            // Hapus file secara fisik dari server jika itu ada di folder lokal /uploads/
            if (dbUser.avatarUrl.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), "public", dbUser.avatarUrl);
                try {
                    await fs.unlink(filePath);
                } catch (e) {
                    console.error("Gagal menghapus file fisik", e);
                }
            }

            // Hapus dari database
            try {
                await (prisma as any).user.update({
                    where: { id: user.id },
                    data: { avatarUrl: null }
                });
            } catch (dbError) {
                console.warn("Prisma cache error on delete:", dbError);
            }
        }

        // Refresh cache halaman profil
        revalidatePath("/profil", "layout");

        return NextResponse.json({ 
            success: true, 
            message: "Foto profil berhasil dihapus" 
        });

    } catch (error: any) {
        console.error("Delete upload error:", error);
        return NextResponse.json({ success: false, message: error.message || "Gagal menghapus foto profil" }, { status: 500 });
    }
}
