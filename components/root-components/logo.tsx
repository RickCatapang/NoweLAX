"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <>
      <div className="sm:hidden visible">
        <Link href="/" className="dark:hidden visible ">
          <Image
            src={"/nowelax-logo-light.png"}
            alt={"Logo"}
            width={40}
            height={40}
          />
        </Link>
        <Link href="/" className="hidden dark:flex">
          <Image
            src={"/nowelax-logo-light.png"}
            alt={"Logo"}
            width={40}
            height={40}
          />
        </Link>
      </div>
      <div className="hidden sm:flex">
        <Link href="/" className="dark:hidden visible ">
          <Image
            src={"/nowelax-logo-light.png"}
            alt={"Logo"}
            width={50}
            height={50}
          />
        </Link>
        <Link href="/" className="hidden dark:flex">
          <Image
            src={"/nowelax-logo-light.png"}
            alt={"Logo"}
            width={50}
            height={50}
          />
        </Link>
      </div>
    </>
  );
}

export default Logo;
