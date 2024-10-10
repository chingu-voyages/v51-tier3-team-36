import { Card, CardHeader, CardBody, Image } from '@nextui-org/react'

const Groups = () => (
  <>
    <div className="flex flex-wrap gap-4">
      <Card className="p-4 w-fit">
        <CardHeader className="pb-0 pt-2 px-2 flex-col items-start">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://nextui.org/images/hero-card-complete.jpeg"
            width={270}
          />
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
        <small className="text-default-500">12 Tracks</small> */}
          <h4 className="font-bold text-large">Singapore Trip</h4>
        </CardBody>
      </Card>
      <Card className="p-4 w-fit">
        <CardHeader className="pb-0 pt-2 px-2 flex-col items-start">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://nextui.org/images/hero-card-complete.jpeg"
            width={270}
          />
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
        <small className="text-default-500">12 Tracks</small> */}
          <h4 className="font-bold text-large">Singapore Trip</h4>
        </CardBody>
      </Card>
    </div>
  </>
)

export default Groups
