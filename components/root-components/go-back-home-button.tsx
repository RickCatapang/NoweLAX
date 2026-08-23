"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { House } from "lucide-react";

export default function GoBackHome() {
  return (
    <>
      <Button asChild>
        <Link href="/">
          <House />
          Go Back Home
        </Link>
      </Button>
    </>
  );
}
