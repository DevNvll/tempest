import aws from 'aws-sdk'
import db from 'db'

const client = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-19',
  region: 'us-east-1'
})

export { client }

async function bootstrapUser(userId: string) {
  const createRoot = db.folder.create({
    data: {
      name: 'My Files',
      isRoot: true,
      userId
    }
  })

  const createTrash = db.folder.create({
    data: {
      name: 'Trash',
      isRoot: true,
      userId
    }
  })

  return Promise.all([createRoot, createTrash])
}

export async function createUser({
  email,
  password,
  name
}: {
  email: string
  password: string
  name: string
}) {
  const cognitoUser = await client
    .adminCreateUser({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'name',
          Value: name
        }
      ]
    })
    .promise()
  await client
    .adminSetUserPassword({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true
    })
    .promise()

  const user = await db.user.create({
    data: {
      id: cognitoUser.User.Attributes.find((a) => a.Name === 'sub').Value,
      email,
      name
    }
  })

  await bootstrapUser(user.id)
  return user
}
