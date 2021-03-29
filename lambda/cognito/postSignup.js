const pg = require('pg')
const cuid = require('cuid')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

async function query(q) {
  const client = await pool.connect()
  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}

async function boostrapUser(sub, name, email) {
  const { rows } = await query(`select id from "User" where id = '${sub}'`)
  if (rows[0]) {
    return
  }
  await query(`
    INSERT INTO "User" ("id", "name", "email") VALUES ('${sub}', '${name}', '${email}');
    INSERT INTO "Folder" ("id", "name", "userId", "isRoot", "createdAt", "updatedAt") VALUES ('${cuid()}', 'My Files', '${sub}', true, now(), now());
    INSERT INTO "Folder" ("id", "name",  "userId", "isRoot", "createdAt", "updatedAt") VALUES ('${cuid()}', 'Trash', '${sub}', true, now(), now());
  `)
  return
}

exports.handler = async (event, context, callback) => {
  const sub = event.request.userAttributes.sub
  const email = event.request.userAttributes.email
  const name = event.request.userAttributes.email.split('@')[0]

  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    context.done(null, event)
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      isBase64Encoded: false
    })
    return
  }

  try {
    await boostrapUser(sub, name, email)
    var response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      isBase64Encoded: false
    }
    context.done(null, event)
    callback(null, response)
    return
  } catch (err) {
    console.log('Database ' + err)
    context.done(null, event)
    callback(null, 'Database ' + err)
    return
  }
}
