const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000
const discordClientId = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
const getDiscordRedirectUri = (req) =>
  process.env.DISCORD_REDIRECT_URI ||
  `${req.protocol}://${req.get('host')}/auth/discord/callback`
const getFrontendUrl = (req) =>
  process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`
const discordGuildId = process.env.DISCORD_GUILD_ID
const discordBotToken = process.env.DISCORD_BOT_TOKEN
const discordAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID
const discordAdminRoleName =
  process.env.DISCORD_ADMIN_ROLE_NAME || 'Modérateur'

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}
const dataFile = path.join(dataDir, 'data.json')
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-z0-9.\-_]/gi, '_')
      .toLowerCase()
    cb(null, `${Date.now()}-${safeName}`)
  },
})
const upload = multer({ storage })
app.use('/uploads', express.static(uploadsDir))

const defaultGames = [
  { id: 'g-dd5e', name: 'Donjons & Dragons 5e', images: [] },
  { id: 'g-cthulhu7', name: 'L’Appel de Cthulhu (v7)', images: [] },
  { id: 'g-pathfinder12', name: 'Pathfinder (1 & 2)', images: [] },
  { id: 'g-cof', name: 'Chroniques Oubliées Fantasy', images: [] },
  { id: 'g-wfrp', name: 'Warhammer Fantasy Roleplay', images: [] },
  { id: 'g-vtm', name: 'Vampire : la Mascarade', images: [] },
  { id: 'g-swffg', name: 'Star Wars (Edge / FFG)', images: [] },
  { id: 'g-cyberpunk', name: 'Cyberpunk Red', images: [] },
  { id: 'g-savage', name: 'Savage Worlds', images: [] },
  { id: 'g-insmv', name: 'INS/MV', images: [] },
  { id: 'g-pf2', name: 'Pathfinder 2', images: [] },
  { id: 'g-cocont', name: 'Chroniques Oubliées Contemporain', images: [] },
  { id: 'g-cogal', name: 'Chroniques Oubliées Galactiques', images: [] },
  { id: 'g-anneau', name: 'L’Anneau Unique', images: [] },
  { id: 'g-alien', name: 'Alien RPG', images: [] },
  { id: 'g-shadowrun', name: 'Shadowrun', images: [] },
  { id: 'g-cocpulp', name: 'Call of Cthulhu Pulp', images: [] },
  { id: 'g-knight', name: 'Knight', images: [] },
  { id: 'g-polaris', name: 'Polaris', images: [] },
  { id: 'g-deadlands', name: 'Deadlands', images: [] },
  { id: 'g-starfinder', name: 'Starfinder', images: [] },
  { id: 'g-myz', name: 'Mutant Year Zero', images: [] },
  { id: 'g-bitd', name: 'Blades in the Dark', images: [] },
  { id: 'g-motw', name: 'Monster of the Week', images: [] },
  { id: 'g-v5', name: 'Vampire V5', images: [] },
  { id: 'g-mage', name: 'Mage : l’Ascension', images: [] },
  { id: 'g-l5r', name: 'L5R – La Légende des Cinq Anneaux', images: [] },
  { id: 'g-tftl', name: 'Tales from the Loop', images: [] },
  { id: 'g-numenera', name: 'Numenera', images: [] },
  { id: 'g-fl', name: 'Forbidden Lands', images: [] },
  { id: 'g-wurm', name: 'Würm', images: [] },
  { id: 'g-brig', name: 'Brigandyne', images: [] },
  { id: 'g-ce', name: 'Chroniques de l’Étrange', images: [] },
  { id: 'g-degenesis', name: 'Degenesis', images: [] },
  { id: 'g-eclipse', name: 'Eclipse Phase', images: [] },
  { id: 'g-kult', name: 'Kult Divinité Perdue', images: [] },
  { id: 'g-symbaroum', name: 'Symbaroum', images: [] },
  { id: 'g-mothership', name: 'Mothership', images: [] },
  { id: 'g-wrath', name: 'Warhammer 40K – Wrath & Glory', images: [] },
  { id: 'g-rogue', name: 'Rogue Trader', images: [] },
  { id: 'g-darkheresy', name: 'Dark Heresy', images: [] },
  { id: 'g-coriolis', name: 'Coriolis', images: [] },
  { id: 'g-fallout', name: 'Fallout RPG', images: [] },
  { id: 'g-earthdawn', name: 'Earthdawn', images: [] },
  { id: 'g-reve', name: 'Rêve de Dragon', images: [] },
  { id: 'g-miles', name: 'Miles Christi', images: [] },
  { id: 'g-vermine', name: 'Vermine 2047', images: [] },
  { id: 'g-cdark', name: 'Cthulhu Dark', images: [] },
  { id: 'g-tinyd', name: 'Tiny Dungeon', images: [] },
  { id: 'g-ironsworn', name: 'Ironsworn', images: [] },
  { id: 'g-citymist', name: 'City of Mist', images: [] },
  { id: 'g-fadingsuns', name: 'Fading Suns', images: [] },
  { id: 'g-paranoia', name: 'Paranoia', images: [] },
  { id: 'g-dungeonworld', name: 'Dungeon World', images: [] },
  { id: 'g-monsterhearts', name: 'Monsterhearts', images: [] },
  { id: 'g-apocalypse', name: 'Apocalypse World', images: [] },
  { id: 'g-onering2', name: 'The One Ring 2e', images: [] },
  { id: 'g-deltagreen', name: 'Delta Green', images: [] },
  { id: 'g-nba', name: 'Night’s Black Agents', images: [] },
  { id: 'g-into', name: 'Into the Odd', images: [] },
  { id: 'g-cairn', name: 'Cairn', images: [] },
  { id: 'g-troika', name: 'Troika!', images: [] },
  { id: 'g-mork', name: 'Mörk Borg', images: [] },
  { id: 'g-pirate', name: 'Pirate Borg', images: [] },
  { id: 'g-vaesen', name: 'Vaesen', images: [] },
  { id: 'g-household', name: 'Household', images: [] },
  { id: 'g-broken', name: 'Broken Compass', images: [] },
  { id: 'g-kob', name: 'Kids on Bikes', images: [] },
  { id: 'g-tftf', name: 'Tales from the Flood', images: [] },
  { id: 'g-root', name: 'Root RPG', images: [] },
  { id: 'g-heart', name: 'Heart – The City Beneath', images: [] },
  { id: 'g-spire', name: 'Spire', images: [] },
  { id: 'g-fiasco', name: 'Fiasco', images: [] },
  { id: 'g-ten', name: 'Ten Candles', images: [] },
  { id: 'g-bluebeard', name: 'Bluebeard’s Bride', images: [] },
  { id: 'g-conan', name: 'Conan 2d20', images: [] },
  { id: 'g-achtung', name: 'Achtung! Cthulhu', images: [] },
  { id: 'g-agone', name: 'Agone', images: [] },
  { id: 'g-nephilim', name: 'Nephilim', images: [] },
  { id: 'g-tedeum', name: 'Te Deum pour un Massacre', images: [] },
  { id: 'g-feals', name: 'Chroniques des Féals', images: [] },
  { id: 'g-malefices', name: 'Maléfices', images: [] },
  { id: 'g-hawkmoon', name: 'Hawkmoon', images: [] },
  { id: 'g-jamesbond', name: 'James Bond RPG', images: [] },
  { id: 'g-serenity', name: 'Serenity RPG', images: [] },
  { id: 'g-statrek', name: 'Star Trek Adventures', images: [] },
  { id: 'g-doctorwho', name: 'Doctor Who RPG', images: [] },
  { id: 'g-scion', name: 'Scion', images: [] },
  { id: 'g-exalted', name: 'Exalted', images: [] },
  { id: 'g-anima', name: 'Anima Beyond Fantasy', images: [] },
  { id: 'g-runequest', name: 'RuneQuest', images: [] },
  { id: 'g-pendragon', name: 'Pendragon', images: [] },
  { id: 'g-arsmagica', name: 'Ars Magica', images: [] },
  { id: 'g-torg', name: 'TORG Eternity', images: [] },
  { id: 'g-hee', name: 'Hollow Earth Expedition', images: [] },
  { id: 'g-vda', name: 'Vampire Dark Ages', images: [] },
  { id: 'g-mta', name: 'Mage the Awakening', images: [] },
  { id: 'g-lgarou', name: 'Loup-Garou l’Apocalypse', images: [] },
  { id: 'g-changelin', name: 'Changelin le Songe', images: [] },
  { id: 'g-swords', name: 'Swords Without Master', images: [] },
]

let tables = []
let games = []
let chats = {}
let users = []

const normalizeUploadUrl = (value) => {
  if (typeof value !== 'string') {
    return value
  }
  const index = value.indexOf('/uploads/')
  if (index === -1) {
    return value
  }
  return value.slice(index)
}

const loadData = () => {
  if (!fs.existsSync(dataFile)) {
    games = defaultGames.map((game) => ({ ...game }))
    tables = []
    return
  }
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    const parsed = JSON.parse(raw)
    games = Array.isArray(parsed.games)
      ? parsed.games.map((game) => ({
          ...game,
          images: Array.isArray(game.images)
            ? game.images.map(normalizeUploadUrl)
            : [],
        }))
      : defaultGames.map((game) => ({ ...game }))
    tables = Array.isArray(parsed.tables)
      ? parsed.tables.map((table) => ({
          ...table,
          image: normalizeUploadUrl(table.image),
        }))
      : []
    chats =
      parsed.chats && typeof parsed.chats === 'object' ? parsed.chats : {}
    users = Array.isArray(parsed.users) ? parsed.users : []
  } catch (error) {
    games = defaultGames.map((game) => ({ ...game }))
    tables = []
    chats = {}
    users = []
  }
}

const persistData = () => {
  try {
    fs.writeFileSync(
      dataFile,
      JSON.stringify({ games, tables, chats, users }, null, 2),
      'utf-8',
    )
  } catch (error) {
    // Ignore persistence failures for now
  }
}

loadData()
persistData()

const generateId = () => `t${Date.now().toString(36)}`
const generateGameId = () => `g${Date.now().toString(36)}`

const withComputedSeats = (table) => {
  const reservations = table.reservations || []
  const validatedCount = reservations.filter(
    (item) => item.status === 'validated',
  ).length
  return {
    ...table,
    reservations,
    seatsTaken: validatedCount,
    status:
      table.status === 'cancelled'
        ? 'cancelled'
        : validatedCount >= table.seatsTotal
          ? 'full'
          : 'open',
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/games', (req, res) => {
  res.json(games)
})

app.post('/api/games', (req, res) => {
  const { name } = req.body || {}
  if (!name) {
    return res.status(400).json({ error: 'Nom du jeu requis.' })
  }
  const existing = games.find(
    (game) => game.name.toLowerCase() === name.toLowerCase(),
  )
  if (existing) {
    return res.status(409).json(existing)
  }
  const game = { id: generateGameId(), name, images: [] }
  games.push(game)
  persistData()
  res.status(201).json(game)
})

app.delete('/api/games/:id', (req, res) => {
  const index = games.findIndex((game) => game.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Jeu introuvable.' })
  }
  games.splice(index, 1)
  persistData()
  res.status(204).send()
})

app.post('/api/games/:id/images', upload.single('image'), (req, res) => {
  const game = games.find((item) => item.id === req.params.id)
  if (!game) {
    return res.status(404).json({ error: 'Jeu introuvable.' })
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Image requise.' })
  }
  const imageUrl = `/uploads/${req.file.filename}`
  game.images = game.images || []
  game.images.unshift(imageUrl)
  persistData()
  res.json(game)
})

app.get('/api/tables', (req, res) => {
  res.json(tables.map(withComputedSeats))
})

app.post('/api/tables', (req, res) => {
  const {
    date,
    time,
    game,
    type,
    seatsTotal,
    gm,
    description,
    image = '',
    level = 'Tous niveaux',
  } = req.body

  if (!date || !time || !game || !type || !seatsTotal || !gm || !description) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  const table = {
    id: generateId(),
    date,
    time,
    game,
    type,
    seatsTotal: Number(seatsTotal),
    seatsTaken: 0,
    level,
    gm,
    status: 'open',
    description,
    reservations: [],
    image,
  }

  tables.push(table)
  persistData()
  res.status(201).json(withComputedSeats(table))
})

app.post('/api/tables/:id/join', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  if (table.status === 'cancelled') {
    return res.status(400).json({ error: 'Table annulée.' })
  }
  const { userId, name, displayName, avatarUrl } = req.body || {}
  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur manquant.' })
  }
  const existing = (table.reservations || []).find(
    (item) => item.userId === userId,
  )
  if (existing) {
    return res.json(withComputedSeats(table))
  }
  table.reservations = table.reservations || []
  table.reservations.push({
    userId,
    name: name || 'Joueur',
    displayName: displayName || name || 'Joueur',
    avatarUrl: avatarUrl || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
  persistData()
  res.json(withComputedSeats(table))
})

app.post('/api/tables/:id/leave', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  const { userId } = req.body || {}
  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur manquant.' })
  }
  table.reservations = (table.reservations || []).filter(
    (item) => item.userId !== userId,
  )
  persistData()
  res.json(withComputedSeats(table))
})

app.post('/api/tables/:id/cancel', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  table.status = 'cancelled'
  persistData()
  res.json(withComputedSeats(table))
})

app.get('/api/tables/:id/requests', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  res.json(table.reservations || [])
})

app.post('/api/tables/:id/validate', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  const { userId } = req.body || {}
  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur manquant.' })
  }
  table.reservations = table.reservations || []
  const target = table.reservations.find((item) => item.userId === userId)
  if (!target) {
    return res.status(404).json({ error: 'Réservation introuvable.' })
  }
  if (withComputedSeats(table).seatsTaken >= table.seatsTotal) {
    return res.status(409).json({ error: 'Table complète.' })
  }
  target.status = 'validated'
  persistData()
  res.json(withComputedSeats(table))
})

app.get('/api/tables/:id/chat', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  res.json(chats[req.params.id] || [])
})

app.post('/api/tables/:id/chat', (req, res) => {
  const table = tables.find((item) => item.id === req.params.id)
  if (!table) {
    return res.status(404).json({ error: 'Table introuvable.' })
  }
  const { userId, name, avatarUrl, text } = req.body || {}
  if (!userId || !text) {
    return res.status(400).json({ error: 'Message invalide.' })
  }
  const entry = {
    id: `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    author: name || 'Utilisateur',
    avatarUrl: avatarUrl || '',
    text,
    createdAt: new Date().toISOString(),
    userId,
  }
  chats[req.params.id] = chats[req.params.id] || []
  chats[req.params.id].push(entry)
  persistData()
  res.json(chats[req.params.id])
})

app.get('/auth/discord', (req, res) => {
  if (!discordClientId) {
    return res.status(500).send('Discord OAuth non configuré.')
  }
  const discordRedirectUri = getDiscordRedirectUri(req)
  const params = new URLSearchParams({
    client_id: discordClientId,
    redirect_uri: discordRedirectUri,
    response_type: 'code',
    scope: 'identify email',
    prompt: 'consent',
  })
  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`)
})

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code
  if (!code) {
    return res.status(400).send('Code manquant.')
  }
  if (!discordClientId || !discordClientSecret) {
    return res.status(500).send('Discord OAuth non configuré.')
  }
  const discordRedirectUri = getDiscordRedirectUri(req)
  const frontendUrl = getFrontendUrl(req)
  try {
    const tokenParams = new URLSearchParams({
      client_id: discordClientId,
      client_secret: discordClientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: discordRedirectUri,
    })

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return res.status(500).send(`Discord token error: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userResponse.ok) {
      return res.status(500).send('Discord user fetch error.')
    }

    const user = await userResponse.json()
    let isAdmin = false
    if (discordGuildId && discordBotToken) {
      const memberResponse = await fetch(
        `https://discord.com/api/guilds/${discordGuildId}/members/${user.id}`,
        {
          headers: { Authorization: `Bot ${discordBotToken}` },
        },
      )
      if (memberResponse.ok) {
        const member = await memberResponse.json()
        if (discordAdminRoleId) {
          isAdmin = member.roles.includes(discordAdminRoleId)
        } else {
          const rolesResponse = await fetch(
            `https://discord.com/api/guilds/${discordGuildId}/roles`,
            {
              headers: { Authorization: `Bot ${discordBotToken}` },
            },
          )
          if (rolesResponse.ok) {
            const roles = await rolesResponse.json()
            const targetRole = roles.find(
              (role) => role.name === discordAdminRoleName,
            )
            if (targetRole) {
              isAdmin = member.roles.includes(targetRole.id)
            }
          }
        }
      }
    }
    const userRecord = {
      id: user.id,
      username: user.username,
      displayName: user.global_name || user.username,
      avatar: user.avatar || '',
    }
    const existingIndex = users.findIndex((item) => item.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userRecord }
    } else {
      users.push(userRecord)
    }
    persistData()

    const params = new URLSearchParams({
      auth: '1',
      id: user.id,
      name: user.username,
      displayName: user.global_name || user.username,
      avatar: user.avatar || '',
      isAdmin: isAdmin ? '1' : '0',
    })
    res.redirect(`${frontendUrl}/?${params.toString()}`)
  } catch (error) {
    res.status(500).send('Erreur OAuth Discord.')
  }
})

app.listen(port, () => {
  console.log(`API JDR prête sur http://localhost:${port}`)
})
