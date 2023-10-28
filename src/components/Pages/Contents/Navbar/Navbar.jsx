"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  HeartIcon,

} from "@heroicons/react/24/outline";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Button, Link } from "@chakra-ui/react";
import { useSession } from "next-auth/react";


const Navbar = async ({ data }) => {
  const session = useSession();
  const [follow, setFollow] = useState();
  useEffect(() => {
    fetch("/api/follow" , { cache: 'no-store' })
      .then((res) => res.json())
      .then((content) => {
        const followfilter = content.find((item) => item.content_id == data._id && item.user_id == session?.data?.user._id);
        setFollow(followfilter)
        setColorMode(followfilter?.status)
      });
  }, [])

  const router = useRouter();
  // Function to go back to the previous page in history
  const goBack = () => {
    router.back();
  };

  const [colorMode, setColorMode] = useState(false);
  const toggleColorMode = async () => {
    if(session.data?.user){
      const status = !colorMode
    const user_id = session.data.user._id
    const content_id = data._id
    setColorMode(!colorMode)

    try {
      const res = await fetch("../api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id,
          status,
          user_id
        })
      });
      const content = await res.json();

      setTimeout(() => {
        setColorMode(content.status)
        setFollow(content)
    }, 2000);


    } catch (error) {
      console.log('error -->', error);
    }

    }else{
      router.push('/login')
    }
    
  };

  const unfollow = async (index) => {

    try {
      const res = await fetch("../api/follow", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index
        })
      });
      const content = await res.json();

      setTimeout(() => {
        setFollow('')
        setColorMode(false)
      }, 2000);

    } catch (error) {
      console.log('error -->', error);
    }
  }
  return (
    <div className="fixed w-full">
      <div id="hiddenElement">
        <header>
          <div className=" w-full my-3 flex justify-between px-14 ">
            <Link href={'/category'}>
              <button>
                <ArrowLeftIcon className="hidden h-6 w-6  sm:inline" />
              </button>
            </Link>

            <div className="flex items-center space-x-4 text-sm ">
              <div>
                {follow ? (
                  <div>
                    {colorMode ? (
                      <AiFillHeart className="hidden h-6 w-6  sm:inline text-red-600" onClick={() => unfollow(follow._id)} />
                    ) : (
                      <AiOutlineHeart className="hidden h-6 w-6  sm:inline" onClick={toggleColorMode} />
                    )}
                  </div>
                ) : (
                  <AiOutlineHeart className="hidden h-6 w-6  sm:inline" onClick={toggleColorMode} />
                )}






              </div>
            </div>


          </div>
        </header>
      </div>
    </div>


  );
};

export default Navbar;