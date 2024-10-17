import { ApiProperty } from '@nestjs/swagger';

export interface IParticipantDocument {
  _id: string;
  name: string;
  email: string;
  friends: [string];
  groups: [string];
  expenses: [string];
  id: string;
}

export interface IPopulatedGroupResponseDto {
  createdBy: string;
  name: string;
  inviteCode: string;
  description?: string;
  budget: number;
  participants: [
    {
      userId: IParticipantDocument;
      contributionWeight: number;
    },
  ];
  expenses: [string];
  id: string;
}

export class ParticipantDocument {
  @ApiProperty({
    description: "The participant's id. Interchangable with the id field",
    example: '6704141ac79df25cb20d2800',
    type: 'string (id)',
  })
  _id: string;

  @ApiProperty({
    description: 'Name of the participant',
    example: 'Test User',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the participant',
    example: 'testuser@email.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: "The user's friends as an array of user ids",
    example: ['670d3ce449a8f6031830a069', '670ffe59c853a9b1ce9d0b02'],
    type: 'Array of strings (ids)',
  })
  friends: [string];

  @ApiProperty({
    description: "The user's groups as an array of group ids",
    example: [
      '670416608d05b54c07678bce',
      '670d3a3049a8f6031830a059',
      '670d3b9f49a8f6031830a064',
    ],
    type: 'Array of strings (ids)',
  })
  groups: [string];

  @ApiProperty({
    description: "The user's expenses as an array of expense ids",
    example: ['670d48ad5da9bd2acb71e553', '670d4ddd3c03640c00e6965b'],
    type: 'Array of strings (ids)',
  })
  expenses: [string];

  @ApiProperty({
    description: "The participant's id. Interchangable with the _id field",
    example: '6704141ac79df25cb20d2800',
    type: 'string (id)',
  })
  id: string;
}

export class PopulatedParticipantObject {
  @ApiProperty({
    description:
      'Populated participant document corresponding to the user id of each participant',
    example: {
      _id: '6704141ac79df25cb20d2800',
      name: 'Test User2',
      email: 'testuser2@email.com',
      friends: ['670d3ce449a8f6031830a069', '670ffe59c853a9b1ce9d0b02'],
      groups: [
        '670416608d05b54c07678bce',
        '670d3a3049a8f6031830a059',
        '670d3b9f49a8f6031830a064',
      ],
      expenses: ['670d48ad5da9bd2acb71e553', '670d4ddd3c03640c00e6965b'],
      id: '6704141ac79df25cb20d2800',
    },
    type: ParticipantDocument,
  })
  userId: ParticipantDocument;

  @ApiProperty({
    description:
      'The percentage of the total budget that the participant is contributing',
    example: 50,
    type: 'number',
  })
  ContributionWeight: number;
}

export class PopulatedGroupResponseDto {
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
        userId: {
          _id: '6704141ac79df25cb20d2800',
          name: 'Test User',
          email: 'testuser@email.com',
          friends: ['670d3ce449a8f6031830a069', '670ffe59c853a9b1ce9d0b02'],
          groups: [
            '670416608d05b54c07678bce',
            '670d3a3049a8f6031830a059',
            '670d3b9f49a8f6031830a064',
          ],
          expenses: ['670d48ad5da9bd2acb71e553', '670d4ddd3c03640c00e6965b'],
          id: '6704141ac79df25cb20d2800',
        },
        contributionWeight: 0,
      },
      {
        userId: {
          _id: '6704141ac79df25cb20d2801',
          name: 'Test User',
          email: 'testuser@email.com',
          friends: ['670d3ce449a8f6031830a069', '670ffe59c853a9b1ce9d0b02'],
          groups: [
            '670416608d05b54c07678bce',
            '670d3a3049a8f6031830a059',
            '670d3b9f49a8f6031830a064',
          ],
          expenses: ['670d48ad5da9bd2acb71e553', '670d4ddd3c03640c00e6965b'],
          id: '6704141ac79df25cb20d2801',
        },
        contributionWeight: 50,
      },
    ],
    type: PopulatedParticipantObject,
    isArray: true,
  })
  participants: [PopulatedParticipantObject];

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
