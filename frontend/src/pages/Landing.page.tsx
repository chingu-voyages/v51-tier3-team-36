import { Link, Button } from '@nextui-org/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Nav from '../components/Nav.component'

export default function Landing() {
  return (
    <>
      <Nav />
      <section className="min-h-screen flex items-center flex-col">
        <DotLottieReact
          src="https://lottie.host/d7773ab6-81b6-46e9-b9c8-eeace7f1ccc9/63osHNRVs3.lottie"
          autoplay
          loop
          className="absolute top-[40%] left-[10%]"
        />
        <DotLottieReact
          src="https://lottie.host/49a13a5a-ee78-41c5-a32e-7f4f806a3f87/oKPv7zBkCt.json"
          autoplay
          loop
          className="absolute top-[30%] right-[10%]"
        />
        <h2 className="text-5xl text-center pt-4 max-w-[1024px]">
          Split Expenses,{' '}
          <span className="relative">
            <span className="absolute top-12 ">
              <DotLottieReact
                src="https://lottie.host/003b1da1-1619-41b6-ba93-c117c0836458/Gyb6Hl7Exc.json"
                autoplay
                width={'150%'}
                height={'35%'}
              />
            </span>
            Simplified
          </span>
        </h2>
        <h2 className="text-5xl text-center max-w-[1024px] pt-8">
          with Expense Splitter
        </h2>
        <p className="max-w-[512px] text-center pt-8">
          Say goodbye to complicated math and awkward conversations.
          Effortlessly track, split, and settle shared costs with ease. Managing
          group expenses has never been easier!
        </p>
        <Button
          className="mt-10 font-bold text-xl"
          as={Link}
          color="primary"
          href="#"
          variant="flat"
        >
          Get Started Now
        </Button>
        <DotLottieReact
          src="https://mocki.io/v1/a844b371-8a31-4f58-bc3a-1dbded179ef4"
          loop
          autoplay
          className="mt-[-10rem]"
          width={500}
          height={500}
        />
      </section>
    </>
  )
}
