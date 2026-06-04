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
