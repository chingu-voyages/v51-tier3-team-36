import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  CardHeader,
  Image,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Group = () => {
  const { groupId } = useParams()
  const [groupDetails, setGroupDetails] = useState({})
  const [participantsList, setParticipantsList] = useState([])

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiI2NzEwN2I4NjZkMTM2MmVjODQ5ZmM2OWEiLCJpYXQiOjE3MjkxMzM0NDYsImV4cCI6MTcyOTEzNzA0Nn0.JHtSbm2ACjvkKpkV-FNVfbYCRKpnq_DfXLc3e5MKzNk`
        }
      })
      .then(async data => {
        console.log(data.data)

        setGroupDetails(data.data)
        const { participants } = data.data

        const participantDetailsPromises = participants.map(participant =>
          axios.get(`http://localhost:3000/api/users/${participant.userId}`, {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiI2NzEwN2I4NjZkMTM2MmVjODQ5ZmM2OWEiLCJpYXQiOjE3MjkxMzM0NDYsImV4cCI6MTcyOTEzNzA0Nn0.JHtSbm2ACjvkKpkV-FNVfbYCRKpnq_DfXLc3e5MKzNk`
            }
          })
        )

        const participantDetails = await Promise.all(participantDetailsPromises)
        setParticipantsList(participantDetails)
      })
  }, [])
  return (
    <>
      <Card className="m-4">
        <CardBody className="overflow-visible p-4">
          <div className="flex gap-4">
            <div className="">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg">{groupDetails.name}</h3>
              <h2 className="text-md">$ {groupDetails.budget}</h2>
            </div>
            <div className="flex gap-4 flex-col">
              <Button color="primary" onPress={() => null}>
                Add Participant
              </Button>
              <Button color="primary" onPress={() => null}>
                Add Expense
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      {participantsList.map(participant => (
        <Card key={participant.email} className="m-4 w-72">
          <CardBody className="overflow-visible p-4">
            <div className="flex gap-4">
              <div className="flex align-middle my-auto">
                <Avatar
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${participant.name}`}
                />
              </div>
              <div className="my-auto">
                <h3 className="font-bold text-lg">{participant.name}</h3>
              </div>
              <div className="my-auto">
                <Chip className="text-white" color="success">
                  Gets $300
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      <Table className="p-4" aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Expense</TableColumn>
          <TableColumn>Date</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Groceries</TableCell>
            <TableCell>25/05/2024</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}

export default Group
