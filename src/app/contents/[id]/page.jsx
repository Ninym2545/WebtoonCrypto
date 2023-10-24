import React from 'react'
import dynamic from "next/dynamic";

const MyClientComponent = dynamic(
    () => import("../../../components/Pages/Contents/Mycomponent"),
    {
        ssr: false, // Treat this component as a "Client Component"
    }
);

async function getData(id) {
    const res = await fetch(`http://localhost:3000/api/showcontents/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return notFound();
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const post = await getData(params.id);
    return {
      title: post?.title,
    };
  }



const page =  ({params}) => {
    return (
        <MyClientComponent content_id={params.id} />
    )
}

export default page