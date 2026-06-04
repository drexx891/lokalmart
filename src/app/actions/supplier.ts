"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerSupplier(formData: FormData) {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            throw new Error("Silakan masuk (login) terlebih dahulu");
        }

        const companyName = formData.get("companyName") as string;
        const description = formData.get("description") as string;
        
        // Advanced fields
        const businessType = formData.get("businessType") as string || "UMKM";
        const province = formData.get("province") as string || "";
        const city = formData.get("city") as string || "";
        const logoUrl = formData.get("logoUrl") as string || "";

        // Data Diri
        const fullName = formData.get("fullName") as string || "";
        const phone = formData.get("phone") as string || "";

        // Data Rekening
        const bankName = formData.get("bankName") as string || "";
        const bankAccount = formData.get("bankAccount") as string || "";
        const bankHolder = formData.get("bankHolder") as string || "";

        if (!companyName || companyName.trim() === "") {
            throw new Error("Nama perusahaan tidak boleh kosong");
        }

        // Cek apakah sudah ada supplier untuk user ini
        const existingSupplier = await prisma.supplier.findUnique({
            where: { userId: user.id }
        });

        if (existingSupplier) {
            throw new Error("Anda sudah memiliki toko/perusahaan yang terdaftar.");
        }

        // Gunakan transaksi agar update role user dan pembuatan profil supplier sukses bersamaan
        await prisma.$transaction([
            prisma.supplier.create({
                data: {
                    userId: user.id,
                    companyName,
                    description,
                    businessType,
                    province,
                    city,
                    logoUrl: logoUrl || null,
                    bankName: bankName || null,
                    bankAccount: bankAccount || null,
                    bankHolder: bankHolder || null,
                    verified: false
                } as any
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { 
                    role: "supplier",
                    name: fullName || undefined,
                    phone: phone || undefined
                } as any
            })
        ]);

        // Update session
        const session = await getSession();
        if (session.userId) {
            session.role = "supplier";
            await session.save();
        }

    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }

    revalidatePath("/");
    redirect("/admin");
}

export async function updateStoreSettings(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Silakan masuk (login) terlebih dahulu");
        }

        const companyName = formData.get("companyName") as string;
        const description = formData.get("description") as string;
        const allowCOD = formData.get("allowCOD") === "true";
        const province = formData.get("province") as string || undefined;
        const city = formData.get("city") as string || undefined;
        const logoUrl = formData.get("logoUrl") as string || undefined;
        const bankName = formData.get("bankName") as string || undefined;
        const bankAccount = formData.get("bankAccount") as string || undefined;
        const bankHolder = formData.get("bankHolder") as string || undefined;

        if (!companyName || companyName.trim() === "") {
            throw new Error("Nama perusahaan tidak boleh kosong");
        }

        const updateData: any = {
            companyName,
            description,
            allowCOD
        };

        // Hanya update field yang dikirim
        if (province !== undefined) updateData.province = province;
        if (city !== undefined) updateData.city = city;
        if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
        if (bankName !== undefined) updateData.bankName = bankName;
        if (bankAccount !== undefined) updateData.bankAccount = bankAccount;
        if (bankHolder !== undefined) updateData.bankHolder = bankHolder;

        await prisma.supplier.update({
            where: { userId: user.id },
            data: updateData
        });

        revalidatePath("/admin/pengaturan");
        revalidatePath("/checkout");
        
        return { success: true, message: "Pengaturan berhasil disimpan" };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}
