import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const flashSaleSchema = z.object({
  title: z.string().min(3, "Judul terlalu pendek"),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isActive: z.boolean().default(true),
  items: z.array(z.object({
    productId: z.string(),
    discountPrice: z.number().positive(),
    stock: z.number().positive()
  })).min(1, "Minimal 1 produk untuk flash sale")
});

export async function GET() {
  try {
    const flashSales = await prisma.flashSale.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    return NextResponse.json({
      status: true,
      message: "Berhasil mengambil data flash sale",
      data: flashSales
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Gagal mengambil data",
      errors: error
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = flashSaleSchema.parse(body);

    if (new Date(validated.startTime) >= new Date(validated.endTime)) {
      return NextResponse.json({
        status: false,
        message: "Waktu selesai harus setelah waktu mulai"
      }, { status: 422 });
    }

    const flashSale = await prisma.flashSale.create({
      data: {
        title: validated.title,
        startTime: new Date(validated.startTime),
        endTime: new Date(validated.endTime),
        isActive: validated.isActive,
        items: {
          create: validated.items.map(item => ({
            productId: item.productId,
            discountPrice: item.discountPrice,
            stock: item.stock
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json({
      status: true,
      message: "Berhasil membuat flash sale",
      data: flashSale
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        status: false,
        message: "Validasi gagal",
        errors: error.flatten().fieldErrors
      }, { status: 422 });
    }
    
    return NextResponse.json({
      status: false,
      message: "Gagal menyimpan data",
      errors: error
    }, { status: 500 });
  }
}
