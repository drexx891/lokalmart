"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { getSession } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";

export async function registerAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);
    
    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const { name, email, password } = parsed.data;
    const role = formData.get("role") as string || "user";

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return { success: false, message: "Email sudah terdaftar" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        const session = await getSession();
        session.userId = user.id;
        session.role = user.role;
        session.isLoggedIn = true;
        await session.save();

        return { success: true, message: "Pendaftaran berhasil!" };
    } catch {
        return { success: false, message: "Terjadi kesalahan sistem" };
    }
}

export async function loginAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const { email, password } = parsed.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return { success: false, message: "Email atau kata sandi salah" };
        }

        if (user.role === 'admin' || user.role === 'supplier') {
            return { success: false, message: `Akses ditolak: Akun ${user.role} tidak dapat masuk melalui portal utama. Silakan gunakan portal khusus.` };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return { success: false, message: "Email atau kata sandi salah" };
        }

        const session = await getSession();
        session.userId = user.id;
        session.role = user.role;
        session.isLoggedIn = true;
        await session.save();

        return { success: true, message: "Berhasil masuk" };
    } catch {
        return { success: false, message: "Terjadi kesalahan sistem" };
    }
}

export async function logoutAction() {
    const session = await getSession();
    session.destroy();
    redirect("/login");
}

export async function adminLoginAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const email = data.email as string;
    const password = data.password as string;
    const pin2FA = data.pin2FA as string;

    if (!email || !password || !pin2FA) {
        return { success: false, message: "Email, Password, dan PIN wajib diisi" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password || user.role !== 'admin') {
            return { success: false, message: "Akses ditolak" };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return { success: false, message: "Email atau kata sandi salah" };
        }

        if (user.pin2FA !== pin2FA) {
            return { success: false, message: "PIN 2FA salah" };
        }

        if (user.isSuspended) {
            return { success: false, message: "Akun ini telah ditangguhkan" };
        }

        const session = await getSession();
        session.userId = user.id;
        session.role = user.role;
        session.isLoggedIn = true;
        await session.save();

        return { success: true, message: "Berhasil masuk sebagai Admin" };
    } catch (error) {
        return { success: false, message: "Terjadi kesalahan sistem" };
    }
}
