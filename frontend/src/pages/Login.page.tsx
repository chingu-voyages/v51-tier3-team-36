import { Avatar, Button, Card, CardBody, Input, Link } from '@nextui-org/react'

const Login = () => (
  <>
    <div className="grid grid-cols-3 gap-4 h-screen">
      <div className="col-span-2"></div>
      <div className="max-h-screen">
        <Card className="h-[calc(100%-2rem)] m-4">
          <CardBody className="flex flex-col justify-between">
            <div className="p-4">
              <h4 className="text-2xl font-bold text-center">Welcome Back!</h4>
              <p className="text-center text-sm">Please enter your details</p>
              <Input className="mt-12" type="email" label="Email" />
              <Input className="mt-8" label="Password" type="password" />
              <Button className="mt-8 w-full" color="primary" variant="solid">
                Login
              </Button>
              <Button
                className="mt-8 w-full text-onBackground bg-gray-200"
                color="secondary"
                variant="solid"
                startContent={
                  <Avatar
                    src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                    className="w-6 h-6 text-tiny bg-transparent"
                  />
                }
              >
                Login with Google
              </Button>
            </div>
            <div className="p-4">
              <p className="text-center text-sm">
                Don&apos;t have an account? <Link>SignUp</Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  </>
)

export default Login
