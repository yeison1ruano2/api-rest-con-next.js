import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      "Error solicitando los usuarios: " + error.message,
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();
  if (!body.email) {
    return new NextResponse(JSON.stringify("El email es obligatorio"), {
      status: 400,
    });
  }
  if (!body.password) {
    return new NextResponse(JSON.stringify("El password es obligatorio"), {
      status: 400,
    });
  }
  try {
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "Usuario creado con éxito" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      "Error creando el usuario, intentelo de nuevo: " + error.message,
      { status: 500 }
    );
  }
};

export const PATCH = async (req: Request) => {
  const body = await req.json();
  try {
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "Id o usuario no se encuentran" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Id invalido" }), {
        status: 400,
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: newUsername,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Usuario no fue encontrado en la base de datos",
        }),
        {
          status: 400,
        }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "Usuario actualizado con éxito" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error actualizando el usuario" }),
      {
        status: 400,
      }
    );
  }
};
