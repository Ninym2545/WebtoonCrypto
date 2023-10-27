import { Spinner } from '@chakra-ui/react'

export default function Loading() {
    // Or a custom loading skeleton component
    return (

        <div className="w-full h-[94vh] flex justify-center">
            <div className="flex flex-col  items-center my-auto">
                <label className="justify-center mx-auto my-2 text-xl text-gray-400">Loading...</label>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='black'
                    size='xl'
                />
            </div>
        </div>
    )

}