import { ApiProperty } from '@nestjs/swagger';

export interface IGroupResponseDto {
  createdBy: string;
  name: string;
  inviteCode: string;
  description?: string;
  budget: number;
  participants: [
    {
      userId: string;
      contributionWeight: number;
    },
  ];
  expenses: [string];
  id: string;
}

export class ParticipantObject {
  @ApiProperty({
    description: 'Id of the participant',
    example: '6704141ac79df25cb20d2800',
    type: 'string (id)',
  })
  userId: string;

  @ApiProperty({
    description:
      'The percentage of the total budget that the participant is contributing',
    example: 50,
    type: 'number',
  })
  ContributionWeight: number;
}

export class GroupResponseDto {
  @ApiProperty({
    description: 'Id of the user who created the group',
    example: '6704141ac79df25cb20d2800',
    type: 'string (id)',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'Weekend Trip',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description:
      'A unique code identifying the group and can be used to invite people to the group',
    example: 'Un5mK3E9',
    type: 'string',
  })
  inviteCode: string;

  @ApiProperty({
    description: 'Description of the group',
    example: 'Weekend cottage at Lake Takama',
    type: 'string',
  })
  description?: string;

  @ApiProperty({
    description: 'Total budget for the group',
    example: 150,
    type: 'number',
  })
  budget: number;

  @ApiProperty({
    description:
      'Participants of the group. Each participant object contains a participant id, and their contribution weight',
    example: [
      {
        userId: '6704141ac79df25cb20d2800',
        contributionWeight: 0,
      },
      {
        userId: '6704141ac79df25cb20d2801',
        contributionWeight: 50,
      },
    ],
    type: ParticipantObject,
    isArray: true,
  })
  participants: [ParticipantObject];

  @ApiProperty({
    description: 'Expense ids corresponding to the expenses for the group',
    example: ['670d48ad5da9bd2acb71e553', '670d4ddd3c03640c00e6965b'],
    type: 'array of strings (ids)',
    isArray: true,
  })
  expenses: [string];

  @ApiProperty({
    description: 'Id of the group',
    example: '670d4ddd3c03640c00e6965b',
    type: 'string (id)',
  })
  id: string;
}
