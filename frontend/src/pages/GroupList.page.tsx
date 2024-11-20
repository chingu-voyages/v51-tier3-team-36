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
  Textarea
} from '@nextui-org/react'

import { FaPlus } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GroupCard from '../components/GroupCard.component'

interface IGroup {
  name: string
  description: string
  budget: number
}

interface IParticipants {
  userId: string
  contributionWeight: number
}

interface IParticipantData {
  
}

interface IGroupData extends IGroup {
  createdBy: string
  inviteCode: string
  participants: Array<IParticipants>
  expenses: Array<string>
  id: string
}

const GroupList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [createGroup, setCreateGroup] = useState<IGroup>({
    name: '',
    description: '',
    budget: 0
  })

  const [groupList, setGroupList] = useState<IGroupData[]>([])

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/groups/for-user', {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiI2NzEwN2I4NjZkMTM2MmVjODQ5ZmM2OWEiLCJpYXQiOjE3MjkxMzM0NDYsImV4cCI6MTcyOTEzNzA0Nn0.JHtSbm2ACjvkKpkV-FNVfbYCRKpnq_DfXLc3e5MKzNk`
        }
      })
      .then(data => {
        console.log(data.data);
        
        setGroupList(data.data)
      })
  }, [])

  const onCreateGroupSubmit = onClose => {
    console.log(createGroup)

    axios
      .post(`http://localhost:3000/api/groups`, createGroup, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiI2NzEwN2I4NjZkMTM2MmVjODQ5ZmM2OWEiLCJpYXQiOjE3MjkxMzM0NDYsImV4cCI6MTcyOTEzNzA0Nn0.JHtSbm2ACjvkKpkV-FNVfbYCRKpnq_DfXLc3e5MKzNk`
        }
      })
      .then(res => {
        console.log(res)

        setCreateGroup({
          name: '',
          description: '',
          budget: 0
        })

        onClose()
      })
  }

  return (
    <>
      <div className="flex m-4">
        <Input className="" type="text" label="Search" />
      </div>
      <div className="flex justify-center flex-wrap m-4 gap-4">
        {groupList.map(group => (
          <GroupCard
            key={group.id}
            budget={group.budget}
            groupImage="https://images.pexels.com/photos/27806130/pexels-photo-27806130/free-photo-of-a-person-is-flying-a-kite-in-the-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            groupName={group.name}
            members={[
              {
                name: 'abc',
                image:
                  'https://images.pexels.com/photos/27806130/pexels-photo-27806130/free-photo-of-a-person-is-flying-a-kite-in-the-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              {
                name: 'abc',
                image:
                  'https://images.pexels.com/photos/27806130/pexels-photo-27806130/free-photo-of-a-person-is-flying-a-kite-in-the-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
            ]}
          />
        ))}
      </div>
      <Button
        className="bottom-4 right-4 fixed"
        isIconOnly
        aria-label="Create Group"
        onPress={onOpen}
      >
        <FaPlus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Group
              </ModalHeader>
              <ModalBody>
                <Input
                  className=""
                  type="text"
                  label="Name"
                  value={createGroup.name}
                  onChange={event =>
                    setCreateGroup(state => ({
                      ...state,
                      name: event.target.value
                    }))
                  }
                />
                <Textarea
                  label="Description"
                  className=""
                  value={createGroup.description}
                  onChange={event =>
                    setCreateGroup(state => ({
                      ...state,
                      description: event.target.value
                    }))
                  }
                />
                <Input
                  className=""
                  type="number"
                  label="Budget"
                  value={createGroup.budget.toString()}
                  onChange={event =>
                    setCreateGroup(state => ({
                      ...state,
                      budget: Number(event.target.value)
                    }))
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => onCreateGroupSubmit(onClose)}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupList
