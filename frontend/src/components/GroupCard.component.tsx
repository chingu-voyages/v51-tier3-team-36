import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Avatar,
  AvatarGroup,
  Chip
} from '@nextui-org/react'

interface IMembers {
  name: string
  image: string
}

interface IGroupCard {
  groupName: string
  groupImage: string
  budget: number
  members: IMembers[]
}

const GroupCard = ({ groupImage, groupName, budget, members }: IGroupCard) => (
  <>
    <Card className="p-4 w-fit hover:shadow-lg hover:cursor-pointer">
      <CardHeader className="pb-0 pt-2 px-2 flex-col items-start">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={groupImage}
          width={270}
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <h3 className="font-bold text-large">{groupName}</h3>
        <Chip color="default" className="mt-2">
          {budget}
        </Chip>
        <AvatarGroup isBordered className="mt-4">
          {members.map(member => (
            <Avatar key={member.name} src={member.image} />
          ))}
        </AvatarGroup>
      </CardBody>
    </Card>
  </>
)

export default GroupCard
