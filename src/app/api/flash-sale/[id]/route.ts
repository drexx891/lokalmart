import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!flashSale) {
      return NextResponse.json({ status: false, message: "Flash sale tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: "Berhasil mengambil detail flash sale",
      data: flashSale
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Gagal mengambil data",
      errors: error
    }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    // Simplified update (hanya update status atau title/time dasar)
    const flashSale = await prisma.flashSale.update({
      where: { id },
      data: {
        title: body.title,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        isActive: body.isActive
      }
    });

    return NextResponse.json({
      status: true,
      message: "Berhasil update flash sale",
      data: flashSale
    });

  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Gagal update data",
      errors: error
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.flashSale.delete({
      where: { id }
    });

    return NextResponse.json({
      status: true,
      message: "Berhasil menghapus flash sale"
    });

  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Gagal menghapus data",
      errors: error
    }, { status: 500 });
  }
}
