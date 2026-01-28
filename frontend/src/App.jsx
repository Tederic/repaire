import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const fallbackTables = []

const systemImages = {
  'D&D 5e':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtUmyIJ-dnVMh7dc_ok1E8-xymt2OPh2UHKi3_41nqV9sh6gX_7vq8XuNlJNWpKLc1ikVRPBN3tc1HokFnKtNMvYKODaPs0OXjxY3QAd_zsau9oiPaXkNEIm-2GawKBFy9CPH3buzNt7SqJ3wyx5MiMbE-SYNAKtQdW3OABqy_40nPFMNEHN5RyiUlhJzNqSBV1JlxPoJ9q4xMYN77ne524J96jnWI06H1oMYP1bXUwZpNR8OFqRDyiCnwTmuMy_LwNwQMTztPKluT',
  'Donjons & Dragons 5e':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtUmyIJ-dnVMh7dc_ok1E8-xymt2OPh2UHKi3_41nqV9sh6gX_7vq8XuNlJNWpKLc1ikVRPBN3tc1HokFnKtNMvYKODaPs0OXjxY3QAd_zsau9oiPaXkNEIm-2GawKBFy9CPH3buzNt7SqJ3wyx5MiMbE-SYNAKtQdW3OABqy_40nPFMNEHN5RyiUlhJzNqSBV1JlxPoJ9q4xMYN77ne524J96jnWI06H1oMYP1bXUwZpNR8OFqRDyiCnwTmuMy_LwNwQMTztPKluT',
  'Cyberpunk RED':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZJwpPBmEa4NBUdAI0oPYsCC4ZZoTSI4DBqkjKCVJ74ijDAd6zMhAfrKDb2HwxEvSls-UbnSoWW1kp7vq_Pl2m8kEqJdXsYh6UmRIT7tsB084FnhgKrj-vu0ukHwxyFTnG406b9peteBWyVb9az9j19Yn6yG46zkZb-0ZM8NFzTV2EOkQZSKe4l2YRVMcjOv_62G7SbBqtJMDG8zmupPUUJZHLcur_td1VIk8J8EDvJCFEs02H0pPybUgekJQaIC5U6pOTh_cwL3C',
  'Cyberpunk Red':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZJwpPBmEa4NBUdAI0oPYsCC4ZZoTSI4DBqkjKCVJ74ijDAd6zMhAfrKDb2HwxEvSls-UbnSoWW1kp7vq_Pl2m8kEqJdXsYh6UmRIT7tsB084FnhgKrj-vu0ukHwxyFTnG406b9peteBWyVb9az9j19Yn6yG46zkZb-0ZM8NFzTV2EOkQZSKe4l2YRVMcjOv_62G7SbBqtJMDG8zmupPUUJZHLcur_td1VIk8J8EDvJCFEs02H0pPybUgekJQaIC5U6pOTh_cwL3C',
}

const defaultImage =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop'

const getDiscordAvatarUrl = (account) => {
  if (!account?.id) {
    return null
  }
  if (account.avatar) {
    return `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png?size=96`
  }
  let fallbackIndex = 0
  try {
    fallbackIndex = Number(BigInt(account.id) % 5n)
  } catch {
    fallbackIndex = 0
  }
  return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`
}

const tabs = [
  { id: 'all', label: 'Toute la semaine' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
]

const discoverSystems = ['Donjons & Dragons 5e', 'Pathfinder 2', 'Cyberpunk Red']

const gameLibrary = [
  {
    name: 'Donjons & Dragons 5e',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtUmyIJ-dnVMh7dc_ok1E8-xymt2OPh2UHKi3_41nqV9sh6gX_7vq8XuNlJNWpKLc1ikVRPBN3tc1HokFnKtNMvYKODaPs0OXjxY3QAd_zsau9oiPaXkNEIm-2GawKBFy9CPH3buzNt7SqJ3wyx5MiMbE-SYNAKtQdW3OABqy_40nPFMNEHN5RyiUlhJzNqSBV1JlxPoJ9q4xMYN77ne524J96jnWI06H1oMYP1bXUwZpNR8OFqRDyiCnwTmuMy_LwNwQMTztPKluT',
      defaultImage,
    ],
  },
  { name: 'L’Appel de Cthulhu (v7)', images: [defaultImage] },
  { name: 'Pathfinder (1 & 2)', images: [defaultImage] },
  { name: 'Chroniques Oubliées Fantasy', images: [defaultImage] },
  { name: 'Warhammer Fantasy Roleplay', images: [defaultImage] },
  { name: 'Vampire : la Mascarade', images: [defaultImage] },
  { name: 'Star Wars (Edge / FFG)', images: [defaultImage] },
  {
    name: 'Cyberpunk Red',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZJwpPBmEa4NBUdAI0oPYsCC4ZZoTSI4DBqkjKCVJ74ijDAd6zMhAfrKDb2HwxEvSls-UbnSoWW1kp7vq_Pl2m8kEqJdXsYh6UmRIT7tsB084FnhgKrj-vu0ukHwxyFTnG406b9peteBWyVb9az9j19Yn6yG46zkZb-0ZM8NFzTV2EOkQZSKe4l2YRVMcjOv_62G7SbBqtJMDG8zmupPUUJZHLcur_td1VIk8J8EDvJCFEs02H0pPybUgekJQaIC5U6pOTh_cwL3C',
      defaultImage,
    ],
  },
  { name: 'Savage Worlds', images: [defaultImage] },
  { name: 'INS/MV', images: [defaultImage] },
  { name: 'Pathfinder 2', images: [defaultImage] },
  { name: 'Chroniques Oubliées Contemporain', images: [defaultImage] },
  { name: 'Chroniques Oubliées Galactiques', images: [defaultImage] },
  { name: 'L’Anneau Unique', images: [defaultImage] },
  { name: 'Alien RPG', images: [defaultImage] },
  { name: 'Shadowrun', images: [defaultImage] },
  { name: 'Call of Cthulhu Pulp', images: [defaultImage] },
  { name: 'Knight', images: [defaultImage] },
  { name: 'Polaris', images: [defaultImage] },
  { name: 'Deadlands', images: [defaultImage] },
  { name: 'Starfinder', images: [defaultImage] },
  { name: 'Mutant Year Zero', images: [defaultImage] },
  { name: 'Blades in the Dark', images: [defaultImage] },
  { name: 'Monster of the Week', images: [defaultImage] },
  { name: 'Vampire V5', images: [defaultImage] },
  { name: 'Mage : l’Ascension', images: [defaultImage] },
  { name: 'L5R – La Légende des Cinq Anneaux', images: [defaultImage] },
  { name: 'Tales from the Loop', images: [defaultImage] },
  { name: 'Numenera', images: [defaultImage] },
  { name: 'Forbidden Lands', images: [defaultImage] },
  { name: 'Würm', images: [defaultImage] },
  { name: 'Brigandyne', images: [defaultImage] },
  { name: 'Chroniques de l’Étrange', images: [defaultImage] },
  { name: 'Degenesis', images: [defaultImage] },
  { name: 'Eclipse Phase', images: [defaultImage] },
  { name: 'Kult Divinité Perdue', images: [defaultImage] },
  { name: 'Symbaroum', images: [defaultImage] },
  { name: 'Mothership', images: [defaultImage] },
  { name: 'Warhammer 40K – Wrath & Glory', images: [defaultImage] },
  { name: 'Rogue Trader', images: [defaultImage] },
  { name: 'Dark Heresy', images: [defaultImage] },
  { name: 'Coriolis', images: [defaultImage] },
  { name: 'Fallout RPG', images: [defaultImage] },
  { name: 'Earthdawn', images: [defaultImage] },
  { name: 'Rêve de Dragon', images: [defaultImage] },
  { name: 'Miles Christi', images: [defaultImage] },
  { name: 'Vermine 2047', images: [defaultImage] },
  { name: 'Cthulhu Dark', images: [defaultImage] },
  { name: 'Tiny Dungeon', images: [defaultImage] },
  { name: 'Ironsworn', images: [defaultImage] },
  { name: 'City of Mist', images: [defaultImage] },
  { name: 'Fading Suns', images: [defaultImage] },
  { name: 'Paranoia', images: [defaultImage] },
  { name: 'Dungeon World', images: [defaultImage] },
  { name: 'Monsterhearts', images: [defaultImage] },
  { name: 'Apocalypse World', images: [defaultImage] },
  { name: 'The One Ring 2e', images: [defaultImage] },
  { name: 'Delta Green', images: [defaultImage] },
  { name: 'Night’s Black Agents', images: [defaultImage] },
  { name: 'Into the Odd', images: [defaultImage] },
  { name: 'Cairn', images: [defaultImage] },
  { name: 'Troika!', images: [defaultImage] },
  { name: 'Mörk Borg', images: [defaultImage] },
  { name: 'Pirate Borg', images: [defaultImage] },
  { name: 'Vaesen', images: [defaultImage] },
  { name: 'Household', images: [defaultImage] },
  { name: 'Broken Compass', images: [defaultImage] },
  { name: 'Kids on Bikes', images: [defaultImage] },
  { name: 'Tales from the Flood', images: [defaultImage] },
  { name: 'Root RPG', images: [defaultImage] },
  { name: 'Heart – The City Beneath', images: [defaultImage] },
  { name: 'Spire', images: [defaultImage] },
  { name: 'Fiasco', images: [defaultImage] },
  { name: 'Ten Candles', images: [defaultImage] },
  { name: 'Bluebeard’s Bride', images: [defaultImage] },
  { name: 'Conan 2d20', images: [defaultImage] },
  { name: 'Achtung! Cthulhu', images: [defaultImage] },
  { name: 'Agone', images: [defaultImage] },
  { name: 'Nephilim', images: [defaultImage] },
  { name: 'Te Deum pour un Massacre', images: [defaultImage] },
  { name: 'Chroniques des Féals', images: [defaultImage] },
  { name: 'Maléfices', images: [defaultImage] },
  { name: 'Hawkmoon', images: [defaultImage] },
  { name: 'James Bond RPG', images: [defaultImage] },
  { name: 'Serenity RPG', images: [defaultImage] },
  { name: 'Star Trek Adventures', images: [defaultImage] },
  { name: 'Doctor Who RPG', images: [defaultImage] },
  { name: 'Scion', images: [defaultImage] },
  { name: 'Exalted', images: [defaultImage] },
  { name: 'Anima Beyond Fantasy', images: [defaultImage] },
  { name: 'RuneQuest', images: [defaultImage] },
  { name: 'Pendragon', images: [defaultImage] },
  { name: 'Ars Magica', images: [defaultImage] },
  { name: 'TORG Eternity', images: [defaultImage] },
  { name: 'Hollow Earth Expedition', images: [defaultImage] },
  { name: 'Vampire Dark Ages', images: [defaultImage] },
  { name: 'Mage the Awakening', images: [defaultImage] },
  { name: 'Loup-Garou l’Apocalypse', images: [defaultImage] },
  { name: 'Changelin le Songe', images: [defaultImage] },
  { name: 'Swords Without Master', images: [defaultImage] },
]

const dayKeyFromDate = (date) => {
  const jsDate = new Date(`${date}T00:00:00`)
  const dayIndex = jsDate.getDay()
  if (dayIndex === 5) return 'friday'
  if (dayIndex === 6) return 'saturday'
  return 'other'
}

const formatDay = (date) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${date}T00:00:00`))

const normalizeTable = (table) => {
  const system = table.system || table.game || 'Donjons & Dragons 5e'
  return {
    id: table.id,
    date: table.date || new Date().toISOString().slice(0, 10),
    time: table.time || table.timeslot || '7:00 PM',
    system,
    title: table.title || table.game || 'Table',
    seatsTotal: Number(table.seatsTotal ?? table.seats_total ?? 0) || 0,
    seatsTaken: Number(table.seatsTaken ?? table.seats_taken ?? 0) || 0,
    gm: table.gm || table.mj || 'MJ',
    status: table.status || 'open',
    image: table.image || systemImages[system] || defaultImage,
    reservations: Array.isArray(table.reservations) ? table.reservations : [],
  }
}

function App() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedSystem, setSelectedSystem] = useState('all')
  const [activeView, setActiveView] = useState('discover')
  const [adminSection, setAdminSection] = useState('tables')
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [joiningId, setJoiningId] = useState(null)
  const [games, setGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [newGameName, setNewGameName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showCreateTable, setShowCreateTable] = useState(false)
  const [creating, setCreating] = useState(false)
  const [chatMessages, setChatMessages] = useState({})
  const [chatDrafts, setChatDrafts] = useState({})
  const [adminChatOpen, setAdminChatOpen] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
  })
  const [campaignMemberDrafts, setCampaignMemberDrafts] = useState({})
  const [campaignErrors, setCampaignErrors] = useState({})
  const [campaignUsers, setCampaignUsers] = useState([])
  const [campaignUsersLoading, setCampaignUsersLoading] = useState(false)
  const prevTablesRef = useRef([])
  const notificationsInitialized = useRef(false)
  const [formState, setFormState] = useState({
    date: '',
    time: '',
    game: '',
    type: 'one-shot',
    seatsTotal: 5,
    description: '',
    image: '',
  })
  const availableGames = useMemo(
    () => (games.length ? games : gameLibrary),
    [games],
  )

  useEffect(() => {
    let cancelled = false

    async function loadTables() {
      try {
        const response = await fetch('http://localhost:4000/api/tables')
        if (!response.ok) {
          throw new Error('API non disponible')
        }
        const payload = await response.json()
        if (!cancelled) {
          setTables(payload.map(normalizeTable))
        }
      } catch (error) {
        if (!cancelled) {
          setTables(fallbackTables)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTables()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (activeView !== 'gm' || !user?.id || loading) {
      return
    }
    const joinedTables = tables
      .filter((table) =>
        table.reservations?.some((item) => item.userId === user?.id),
      )
      .map((table) => table.id)
    const missing = joinedTables.filter((tableId) => !chatMessages[tableId])
    if (missing.length === 0) {
      return
    }
    Promise.all(
      missing.map(async (tableId) => {
        try {
          const response = await fetch(
            `http://localhost:4000/api/tables/${tableId}/chat`,
          )
          if (!response.ok) {
            return null
          }
          const payload = await response.json()
          return [tableId, payload]
        } catch (error) {
          return null
        }
      }),
    ).then((results) => {
      setChatMessages((prev) => {
        const next = { ...prev }
        results.forEach((entry) => {
          if (entry) {
            const [tableId, messages] = entry
            next[tableId] = Array.isArray(messages) ? messages : []
          }
        })
        return next
      })
    })
  }, [activeView, chatMessages, loading, tables, user?.id])

  const handleSendChatMessage = async (tableId) => {
    const text = (chatDrafts[tableId] || '').trim()
    if (!text) {
      return
    }
    const authorName = user?.displayName || user?.name || 'Utilisateur'
    const authorAvatar = getDiscordAvatarUrl(user)
    try {
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            name: authorName,
            avatarUrl: authorAvatar,
            text,
          }),
        },
      )
      if (!response.ok) {
        throw new Error('Chat send failed')
      }
      const payload = await response.json()
      setChatMessages((prev) => ({
        ...prev,
        [tableId]: Array.isArray(payload) ? payload : [],
      }))
    } catch (error) {
      // Fallback local if API down
      setChatMessages((prev) => {
        const next = { ...prev }
        const messages = next[tableId] ? [...next[tableId]] : []
        messages.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          author: authorName,
          avatarUrl: authorAvatar,
          text,
          createdAt: new Date().toISOString(),
        })
        next[tableId] = messages
        return next
      })
    } finally {
      setChatDrafts((prev) => ({ ...prev, [tableId]: '' }))
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadGames() {
      try {
        setGamesLoading(true)
        const response = await fetch('http://localhost:4000/api/games')
        if (!response.ok) {
          throw new Error('API jeux indisponible')
        }
        const payload = await response.json()
        if (!cancelled) {
          setGames(payload)
        }
      } catch (error) {
        if (!cancelled) {
          setGames([])
        }
      } finally {
        if (!cancelled) {
          setGamesLoading(false)
        }
      }
    }

    loadGames()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('discordUser')
    if (stored) {
      setIsAuthenticated(true)
      setUser(JSON.parse(stored))
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === '1') {
      const payload = {
        id: params.get('id') || '',
        name: params.get('name') || 'Utilisateur',
        displayName: params.get('displayName') || params.get('name') || '',
        avatar: params.get('avatar') || '',
        isAdmin: params.get('isAdmin') === '1',
      }
      localStorage.setItem('discordUser', JSON.stringify(payload))
      setIsAuthenticated(true)
      setUser(payload)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        const payload = JSON.parse(stored)
        if (Array.isArray(payload)) {
          setNotifications(payload)
        }
      }
    } catch (error) {
      // Ignore malformed storage
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (error) {
      // Ignore storage failures
    }
  }, [notifications])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('campaigns')
      if (stored) {
        const payload = JSON.parse(stored)
        if (Array.isArray(payload)) {
          setCampaigns(payload)
        }
      }
    } catch (error) {
      // Ignore malformed storage
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('campaigns', JSON.stringify(campaigns))
    } catch (error) {
      // Ignore storage failures
    }
  }, [campaigns])

  useEffect(() => {
    if (activeView !== 'campaigns') {
      return
    }
    let cancelled = false
    async function loadCampaignUsers() {
      try {
        setCampaignUsersLoading(true)
        const response = await fetch('http://localhost:4000/api/users')
        if (!response.ok) {
          throw new Error('Users fetch failed')
        }
        const payload = await response.json()
        if (!cancelled) {
          setCampaignUsers(Array.isArray(payload) ? payload : [])
        }
      } catch (error) {
        if (!cancelled) {
          setCampaignUsers([])
        }
      } finally {
        if (!cancelled) {
          setCampaignUsersLoading(false)
        }
      }
    }
    loadCampaignUsers()
    return () => {
      cancelled = true
    }
  }, [activeView])

  useEffect(() => {
    if (!user?.id || loading) {
      return
    }
    if (!notificationsInitialized.current) {
      prevTablesRef.current = tables
      notificationsInitialized.current = true
      return
    }
    const previousTables = prevTablesRef.current || []
    const newEvents = []

    tables.forEach((table) => {
      const prevTable = previousTables.find((item) => item.id === table.id)
      const prevReservations = prevTable?.reservations || []
      const currReservations = table.reservations || []

      if (table.gm === user?.name) {
        currReservations
          .filter((reservation) => reservation.status === 'pending')
          .forEach((reservation) => {
            const alreadyHad = prevReservations.some(
              (prev) =>
                prev.userId === reservation.userId &&
                prev.status === reservation.status,
            )
            if (!alreadyHad) {
              const displayName =
                reservation.displayName || reservation.name || 'Joueur'
              newEvents.push({
                key: `join:${table.id}:${reservation.userId}`,
                type: 'join',
                tableId: table.id,
                message: `${displayName} s'est inscrit·e à "${table.title}".`,
              })
            }
          })
      }

      const currentReservation = currReservations.find(
        (reservation) => reservation.userId === user.id,
      )
      const previousReservation = prevReservations.find(
        (reservation) => reservation.userId === user.id,
      )
      if (
        currentReservation?.status === 'validated' &&
        previousReservation?.status !== 'validated'
      ) {
        newEvents.push({
          key: `validated:${table.id}:${user.id}`,
          type: 'validated',
          tableId: table.id,
          message: `Votre inscription à "${table.title}" a été validée.`,
        })
      }
    })

    if (newEvents.length > 0) {
      setNotifications((prev) => {
        const existingKeys = new Set(prev.map((item) => item.key))
        const next = [...prev]
        newEvents.forEach((event) => {
          if (!existingKeys.has(event.key)) {
            next.unshift({
              id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              createdAt: new Date().toISOString(),
              read: false,
              ...event,
            })
          }
        })
        return next
      })
    }

    prevTablesRef.current = tables
  }, [loading, tables, user?.id, user?.name])

  const userDisplayName = user?.displayName || user?.name || 'Utilisateur'
  const userAvatarUrl = getDiscordAvatarUrl(user)

  const visibleTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesTab =
        selectedTab === 'all' || dayKeyFromDate(table.date) === selectedTab
      const matchesSystem =
        selectedSystem === 'all' ||
        table.system === selectedSystem ||
        (selectedSystem === 'Cyberpunk' &&
          table.system.toLowerCase().includes('cyberpunk'))
      return matchesTab && matchesSystem
    })
  }, [tables, selectedSystem, selectedTab])

  const visibleCampaigns = useMemo(() => {
    if (!user?.id) {
      return []
    }
    return campaigns.filter((campaign) => {
      if (campaign.ownerId === user.id) {
        return true
      }
      return (campaign.members || []).some(
        (member) =>
          member.userId === user.id ||
          member.name === userDisplayName ||
          member.name === user?.name,
      )
    })
  }, [campaigns, user?.id, user?.name, userDisplayName])

  const handleCreateCampaign = (event) => {
    event.preventDefault()
    const name = campaignForm.name.trim()
    if (!name) {
      return
    }
    const description = campaignForm.description.trim()
    const newCampaign = {
      id: `c${Date.now().toString(36)}`,
      name,
      description,
      ownerId: user?.id,
      ownerName: userDisplayName,
      members: [
        {
          userId: user?.id,
          name: userDisplayName,
          avatarUrl: userAvatarUrl || '',
        },
      ],
      createdAt: new Date().toISOString(),
    }
    setCampaigns((prev) => [newCampaign, ...prev])
    setCampaignForm({ name: '', description: '' })
  }

  const handleAddCampaignMember = (campaignId) => {
    const draft = (campaignMemberDrafts[campaignId] || '').trim()
    if (!draft) {
      return
    }
    const matchingUser = campaignUsers.find((userItem) => {
      const name = (userItem.displayName || userItem.username || '').toLowerCase()
      return name === draft.toLowerCase()
    })
    if (!matchingUser) {
      setCampaignErrors((prev) => ({
        ...prev,
        [campaignId]: 'Utilisateur Discord introuvable.',
      }))
      return
    }
    setCampaignErrors((prev) => ({ ...prev, [campaignId]: '' }))
    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (campaign.id !== campaignId) {
          return campaign
        }
        const members = campaign.members || []
        const exists = members.some(
          (member) => member.userId === matchingUser.id,
        )
        if (exists) {
          return campaign
        }
        return {
          ...campaign,
          members: [
            ...members,
            {
              userId: matchingUser.id,
              name: matchingUser.displayName || matchingUser.username || 'Joueur',
              avatarUrl: getDiscordAvatarUrl(matchingUser),
            },
          ],
        }
      }),
    )
    setCampaignMemberDrafts((prev) => ({ ...prev, [campaignId]: '' }))
  }

  const handleJoin = async (tableId) => {
    try {
      setJoiningId(tableId)
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            name: user?.name,
            displayName: user?.displayName || user?.name,
            avatarUrl: userAvatarUrl || '',
          }),
        },
      )
      if (!response.ok) {
        throw new Error('Join failed')
      }
      const updated = normalizeTable(await response.json())
      setTables((prev) =>
        prev.map((table) => (table.id === updated.id ? updated : table)),
      )
    } catch (error) {
      // Ignore for MVP
    } finally {
      setJoiningId(null)
    }
  }

  const handleLeave = async (tableId) => {
    try {
      setJoiningId(tableId)
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/leave`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        },
      )
      if (!response.ok) {
        throw new Error('Leave failed')
      }
      const updated = normalizeTable(await response.json())
      setTables((prev) =>
        prev.map((table) => (table.id === updated.id ? updated : table)),
      )
    } catch (error) {
      // Ignore for MVP
    } finally {
      setJoiningId(null)
    }
  }

  const handleValidate = async (tableId, targetUserId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetUserId }),
        },
      )
      if (!response.ok) {
        throw new Error('Validate failed')
      }
      const updated = normalizeTable(await response.json())
      setTables((prev) =>
        prev.map((table) => (table.id === updated.id ? updated : table)),
      )
    } catch (error) {
      // Ignore for MVP
    }
  }

  const handleCancelTable = async (tableId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/cancel`,
        {
          method: 'POST',
        },
      )
      if (!response.ok) {
        throw new Error('Cancel failed')
      }
      const updated = normalizeTable(await response.json())
      setTables((prev) =>
        prev.map((table) => (table.id === updated.id ? updated : table)),
      )
    } catch (error) {
      // Ignore for MVP
    }
  }

  const fetchChatForTable = async (tableId) => {
    if (chatMessages[tableId]) {
      return
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/tables/${tableId}/chat`,
      )
      if (!response.ok) {
        return
      }
      const payload = await response.json()
      setChatMessages((prev) => ({
        ...prev,
        [tableId]: Array.isArray(payload) ? payload : [],
      }))
    } catch (error) {
      // Ignore for MVP
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('discordUser')
    setIsAuthenticated(false)
    setUser(null)
    setShowAccountMenu(false)
  }

  const handleOpenCreate = () => {
    setFormState({
      date: new Date().toISOString().slice(0, 10),
      time: '20:30 - 00:00',
      game: '',
      type: 'one-shot',
      seatsTotal: 5,
      description: '',
      image: '',
    })
    setShowCreateTable(true)
  }

  const handleCreateTable = async (event) => {
    event.preventDefault()
    if (!user?.name) {
      return
    }
    try {
      setCreating(true)
      const matchingGame = availableGames.find(
        (game) => game.name.toLowerCase() === formState.game.toLowerCase(),
      )
      const image =
        formState.image || matchingGame?.images?.[0] || formState.image
      const payload = {
        date: formState.date,
        time: formState.time,
        game: formState.game,
        type: formState.type,
        seatsTotal: Number(formState.seatsTotal),
        gm: user.name,
        description: formState.description,
        image,
      }
      const response = await fetch('http://localhost:4000/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error('Create failed')
      }
      const created = normalizeTable(await response.json())
      setTables((prev) => [created, ...prev])
      setShowCreateTable(false)
    } catch (error) {
      // Ignore for MVP
    } finally {
      setCreating(false)
    }
  }

  const handleCreateGame = async (event) => {
    event.preventDefault()
    const name = newGameName.trim()
    if (!name) return
    try {
      const response = await fetch('http://localhost:4000/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok && response.status !== 409) {
        throw new Error('Create game failed')
      }
      const game = await response.json()
      setGames((prev) => {
        if (prev.find((item) => item.id === game.id)) return prev
        return [...prev, game]
      })
      setNewGameName('')
    } catch (error) {
      // Ignore for MVP
    }
  }

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/games/${gameId}`,
        { method: 'DELETE' },
      )
      if (!response.ok && response.status !== 204) {
        throw new Error('Delete game failed')
      }
      setGames((prev) => prev.filter((item) => item.id !== gameId))
    } catch (error) {
      // Ignore for MVP
    }
  }

  const handleUploadGameImage = async (gameId, file, resetInput) => {
    if (!file) return
    try {
      const data = new FormData()
      data.append('image', file)
      const response = await fetch(
        `http://localhost:4000/api/games/${gameId}/images`,
        { method: 'POST', body: data },
      )
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      const updated = await response.json()
      setGames((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (error) {
      // Ignore for MVP
    } finally {
      if (resetInput) resetInput()
    }
  }

  const renderTopHeader = (subtitle) => (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#2E2922] text-[#D0BB95]">
            <span className="material-symbols-outlined">castle</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-white">
              Repaire du Drac
            </h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#EB980B]">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="relative flex gap-2">
          <button
            className={`relative flex size-10 items-center justify-center rounded-full bg-[#1E293B] ${
              notifications.some((item) => !item.read)
                ? 'text-rose-400'
                : 'text-white'
            }`}
            onClick={() => {
              setShowNotifications((prev) => !prev)
              setShowAccountMenu(false)
              setNotifications((prev) =>
                prev.map((item) => ({ ...item, read: true })),
              )
            }}
          >
            <span className="material-symbols-outlined text-[24px]">
              notifications
            </span>
            {notifications.some((item) => !item.read) && (
              <span className="absolute right-1 top-1 inline-flex size-2 rounded-full bg-primary"></span>
            )}
          </button>
          <button
            className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-[#1E293B] text-white"
            onClick={() => {
              setShowAccountMenu((prev) => !prev)
              setShowNotifications(false)
            }}
          >
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={userDisplayName}
                className="size-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-[24px]">
                account_circle
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-12 top-12 z-50 w-72 rounded-xl border border-white/10 bg-[#1d1a15] p-3 text-sm text-white shadow-2xl">
              <div className="mb-2 border-b border-white/10 pb-2">
                <p className="text-xs uppercase tracking-widest text-[#EB980B]">
                  Notifications
                </p>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Aucune notification pour le moment.
                </p>
              ) : (
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-[#282520] p-2 text-xs text-slate-200"
                    >
                      {item.message}
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => setNotifications([])}
                >
                  Effacer les notifications
                </button>
              )}
            </div>
          )}
          {showAccountMenu && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-white/10 bg-[#1d1a15] p-3 text-sm text-white shadow-2xl">
              <div className="mb-2 border-b border-white/10 pb-2">
                <p className="text-xs uppercase tracking-widest text-[#EB980B]">
                  Compte
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt={userDisplayName}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[24px] text-slate-400">
                      account_circle
                    </span>
                  )}
                  <p className="font-semibold">{userDisplayName}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {user?.isAdmin ? 'Modérateur' : 'Joueur'}
                </p>
              </div>
              <button
                className="w-full rounded-lg bg-[#1E293B] px-3 py-2 text-left text-sm font-semibold text-white"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
        {renderTopHeader('Bienvenue')}
        <main className="flex flex-col items-center px-6 py-16 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#2E2922] text-[#D0BB95]">
            <span className="material-symbols-outlined text-[32px]">
              castle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Rejoignez vos tables JDR
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            Connectez-vous avec Discord pour gérer vos tables, rejoindre une
            session et suivre les disponibilités en temps réel.
          </p>
          <a
            href="http://localhost:4000/auth/discord"
            className="mt-8 flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-[#5865F2] text-sm font-bold text-white shadow-[0_0_20px_rgba(88,101,242,0.35)]"
          >
            Connexion Discord
          </a>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
      {activeView === 'discover' ? (
        <>
          {renderTopHeader('Compagnon JDR')}

          <main className="flex flex-col pb-24">
            <section className="px-4 pt-4">
              <div className="flex justify-between border-b border-primary/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
                      selectedTab === tab.id
                        ? 'border-b-primary text-white'
                        : 'border-b-transparent text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <p className="text-sm font-bold leading-normal tracking-wide">
                      {tab.label}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="no-scrollbar flex gap-2 overflow-x-auto p-4">
              <button
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#D0BB95] px-4 text-sm font-bold text-background-dark"
                onClick={() => setSelectedSystem('all')}
              >
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                Filtres
              </button>
              {discoverSystems.map((system) => (
                <button
                  key={system}
                  type="button"
                  onClick={() => setSelectedSystem(system)}
                  aria-pressed={selectedSystem === system}
                  className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-[#282520] px-4 text-white"
                >
                  <p className="text-sm font-medium">{system}</p>
                  <span className="material-symbols-outlined text-[18px] text-accent-amber">
                    expand_more
                  </span>
                </button>
              ))}
            </section>

            <section className="flex items-center justify-between px-4 pt-2">
              <h2 className="text-[22px] font-bold leading-tight tracking-tight text-white">
                Tables en cours
              </h2>
              <span className="rounded bg-[#332713] px-2 py-1 text-xs font-bold uppercase tracking-tighter text-[#F59E0B]">
                {loading ? 'Chargement' : `${visibleTables.length} tables trouvés`}
              </span>
            </section>

            <section className="flex flex-col gap-6 p-4">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                  Chargement des tables...
                </div>
              ) : visibleTables.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                  Aucune table pour l’instant. Créez-en une avec le bouton “+”.
                </div>
              ) : (
                visibleTables.map((table) => {
                  const seatsLeft = table.seatsTotal - table.seatsTaken
                  const dayLabel = formatDay(table.date)
                  const systemLabel =
                    table.system === 'Cyberpunk RED' ? 'Cyberpunk RED' : table.system
                  const reservation = table.reservations.find(
                    (item) => item.userId === user?.id,
                  )
                  const isPending = reservation?.status === 'pending'
                  const isValidated = reservation?.status === 'validated'
                  return (
                    <div
                      key={table.id}
                      className="relative flex flex-col items-stretch justify-start overflow-hidden rounded-xl bg-slate-900 shadow-2xl"
                    >
                      <div
                        className="relative h-[240px] w-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${table.image}")` }}
                      >
                        <div className="tavern-gradient absolute inset-0"></div>
                        <div className="absolute right-4 top-4 flex min-w-[70px] flex-col items-center rounded-xl border border-white/10 bg-background-dark/80 p-2.5 backdrop-blur-md">
                          <span className="text-2xl font-black leading-none text-primary">
                            {seatsLeft}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                            places restantes
                          </span>
                        </div>
                      </div>
                      <div className="-mt-16 relative z-10 flex flex-col gap-2 p-5">
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-white">
                          {table.title}
                        </h3>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-3 text-slate-300">
                            <div className="flex size-6 items-center justify-center rounded-full bg-accent-amber">
                              <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">
                                person
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              GM: <span className="text-white">{table.gm}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span className="flex size-6 items-center justify-center rounded-full bg-accent-amber/20">
                                <span className="material-symbols-outlined text-[18px] text-[#F59E0B]">
                                  calendar_today
                                </span>
                              </span>
                              <p className="text-sm">{dayLabel}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="flex size-6 items-center justify-center rounded-full bg-accent-amber/20">
                                <span className="material-symbols-outlined text-[18px] text-[#F59E0B]">
                                  schedule
                                </span>
                              </span>
                              <p className="text-sm">{table.time}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="flex -space-x-2">
                            {(table.reservations || [])
                              .slice(0, 2)
                              .map((reservation, index) => {
                                const displayName =
                                  reservation.displayName ||
                                  reservation.name ||
                                  'Joueur'
                                return (
                                  <div
                                    key={`${reservation.userId}-${index}`}
                                    className="size-8 overflow-hidden rounded-full border-2 border-background-dark bg-slate-700"
                                  >
                                    {reservation.avatarUrl ? (
                                      <img
                                        src={reservation.avatarUrl}
                                        alt={displayName}
                                        className="size-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex size-full items-center justify-center text-[10px] font-bold text-white">
                                        {displayName.slice(0, 1)}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            {(table.reservations || []).length > 2 && (
                              <div className="flex size-8 items-center justify-center rounded-full border-2 border-background-dark bg-slate-800">
                                <span className="text-[10px] font-bold text-white">
                                  +{(table.reservations || []).length - 2}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            className="flex h-11 max-w-[160px] flex-1 items-center justify-center overflow-hidden rounded-full bg-[#D0BB95] px-6 text-sm font-bold leading-normal text-background-dark shadow-[0_0_20px_rgba(208,187,149,0.35)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={
                              seatsLeft <= 0 || joiningId === table.id || isPending || isValidated
                            }
                            onClick={() => handleJoin(table.id)}
                          >
                            {joiningId === table.id
                              ? 'Inscription...'
                              : isValidated
                                ? 'Validé'
                                : isPending
                                  ? 'En attente'
                                  : 'Rejoindre'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-primary/60">
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    autostop
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Recherche d’autres tables...
                  </p>
                </div>
              </div>
            </section>
          </main>

        </>
      ) : activeView === 'gm' ? (
        <>
          {renderTopHeader('Mes tables')}

          <main className="mx-auto w-full max-w-md flex-1 pb-32">
            <section className="px-4 py-6">
              <h2 className="text-lg font-bold text-white">
                Mes inscriptions
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {tables.filter((table) =>
                  table.reservations?.some(
                    (item) => item.userId === user?.id,
                  ),
                ).length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    Aucune inscription pour le moment.
                  </div>
                ) : (
                  tables
                    .filter((table) =>
                      table.reservations?.some(
                        (item) => item.userId === user?.id,
                      ),
                    )
                    .map((table) => {
                      const reservation = table.reservations.find(
                        (item) => item.userId === user?.id,
                      )
                      const tableMessages = chatMessages[table.id] || []
                      return (
                        <div
                          key={`join-${table.id}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <h3 className="text-base font-bold text-white">
                            {table.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                          {formatDay(table.date)} • {table.time}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-[#EB980B]">
                            {reservation?.status === 'validated'
                              ? 'Validé'
                              : 'En attente'}
                          </p>
                          <div className="mt-4 rounded-xl border border-white/10 bg-[#1f1c17] p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Chat de la table
                            </p>
                            <div className="mt-2 max-h-32 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-[#191611] p-2">
                              {tableMessages.length === 0 ? (
                                <p className="text-xs text-slate-500">
                                  Aucun message pour le moment.
                                </p>
                              ) : (
                                tableMessages.map((message) => (
                                  <div
                                    key={message.id}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    {message.avatarUrl ? (
                                      <img
                                        src={message.avatarUrl}
                                        alt={message.author}
                                        className="size-5 rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="material-symbols-outlined text-[18px] text-slate-500">
                                        account_circle
                                      </span>
                                    )}
                                    <div>
                                      <span className="font-semibold text-white">
                                        {message.author}
                                      </span>
                                      <span className="text-slate-500"> · </span>
                                      <span className="text-slate-300">
                                        {message.text}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="text"
                                className="h-9 flex-1 rounded-full border border-white/10 bg-[#282520] px-4 text-xs text-white"
                                placeholder="Écrire un message..."
                                value={chatDrafts[table.id] || ''}
                                onChange={(event) =>
                                  setChatDrafts((prev) => ({
                                    ...prev,
                                    [table.id]: event.target.value,
                                  }))
                                }
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault()
                                    handleSendChatMessage(table.id)
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="h-9 rounded-full bg-primary px-4 text-xs font-bold text-background-dark"
                                onClick={() => handleSendChatMessage(table.id)}
                                disabled={!chatDrafts[table.id]?.trim()}
                              >
                                Envoyer
                              </button>
                            </div>
                          </div>
                          <button
                            className="mt-3 inline-flex h-9 items-center justify-center rounded-full border border-[#D0BB95] px-4 text-xs font-bold text-[#D0BB95]"
                            onClick={() => handleLeave(table.id)}
                            disabled={joiningId === table.id}
                          >
                            {joiningId === table.id
                              ? 'Annulation...'
                              : 'Annuler mon inscription'}
                          </button>
                        </div>
                      )
                    })
                )}
              </div>
            </section>

            <section className="px-4 pb-10">
              <h2 className="text-lg font-bold text-white">
                Mes tables MJ
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {tables.filter((table) => table.gm === user?.name).length ===
                0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    Aucune table créée pour le moment.
      </div>
                ) : (
                  tables
                    .filter((table) => table.gm === user?.name)
                    .map((table) => {
                      const pending = table.reservations.filter(
                        (item) => item.status === 'pending',
                      )
                      return (
                        <div
                          key={`gm-${table.id}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <h3 className="text-base font-bold text-white">
                            {table.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                          {formatDay(table.date)} • {table.time}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {table.seatsTaken}/{table.seatsTotal} places
                            validées
                          </p>
                          {pending.length === 0 ? (
                            <p className="mt-3 text-xs text-slate-400">
                              Aucune demande en attente.
                            </p>
                          ) : (
                            <div className="mt-3 flex flex-col gap-2">
                              {pending.map((player) => (
                                <div
                                  key={player.userId}
                                  className="flex items-center justify-between rounded-lg border border-white/10 bg-[#282520] px-3 py-2"
                                >
                                  <span className="text-xs text-white">
                                    {player.displayName || player.name}
                                  </span>
                                  <button
                                    className="rounded-full bg-[#D0BB95] px-3 py-1 text-xs font-bold text-background-dark"
                                    onClick={() =>
                                      handleValidate(table.id, player.userId)
                                    }
                                  >
                                    Valider
        </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </section>
          </main>
        </>
      ) : activeView === 'campaigns' ? (
        <>
          {renderTopHeader('Campagnes')}

          <main className="mx-auto w-full max-w-md flex-1 pb-32">
            <section className="px-4 py-6">
              <h2 className="text-lg font-bold text-white">
                Créer une campagne
              </h2>
              <form
                className="mt-4 grid gap-3"
                onSubmit={handleCreateCampaign}
              >
                <input
                  type="text"
                  className="h-10 rounded-full border border-white/10 bg-[#282520] px-4 text-sm text-white"
                  placeholder="Nom de la campagne"
                  value={campaignForm.name}
                  onChange={(event) =>
                    setCampaignForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                />
                <textarea
                  className="min-h-[96px] rounded-2xl border border-white/10 bg-[#282520] px-4 py-3 text-sm text-white"
                  placeholder="Description (optionnel)"
                  value={campaignForm.description}
                  onChange={(event) =>
                    setCampaignForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-[#D0BB95] text-sm font-bold text-background-dark"
                >
                  Créer la campagne
                </button>
              </form>
            </section>

            <section className="px-4 pb-10">
              <h2 className="text-lg font-bold text-white">
                Mes campagnes
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {visibleCampaigns.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    Aucune campagne pour le moment.
                  </div>
                ) : (
                  visibleCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {campaign.name}
                          </h3>
                          {campaign.description ? (
                            <p className="mt-1 text-xs text-slate-400">
                              {campaign.description}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs text-slate-500">
                            Créée par {campaign.ownerName || 'MJ'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(campaign.members || []).length === 0 ? (
                          <span className="text-xs text-slate-500">
                            Aucun joueur ajouté.
                          </span>
                        ) : (
                          (campaign.members || []).map((member, index) => (
                            <div
                              key={`${campaign.id}-member-${index}`}
                              className="flex items-center gap-2 rounded-full border border-white/10 bg-[#282520] px-2 py-1 text-xs text-slate-200"
                            >
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name || 'Joueur'}
                                  className="size-5 rounded-full object-cover"
                                />
                              ) : (
                                <span className="flex size-5 items-center justify-center rounded-full bg-[#1f1c17] text-[10px] font-bold text-white">
                                  {(member.name || '?').slice(0, 1)}
                                </span>
                              )}
                              <span>{member.name || 'Joueur'}</span>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          className="h-9 flex-1 rounded-full border border-white/10 bg-[#282520] px-4 text-xs text-white"
                          placeholder="Ajouter un joueur"
                          value={campaignMemberDrafts[campaign.id] || ''}
                          onChange={(event) =>
                            setCampaignMemberDrafts((prev) => ({
                              ...prev,
                              [campaign.id]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              handleAddCampaignMember(campaign.id)
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="h-9 rounded-full bg-primary px-4 text-xs font-bold text-background-dark"
                          onClick={() => handleAddCampaignMember(campaign.id)}
                          disabled={
                            !(campaignMemberDrafts[campaign.id] || '').trim()
                          }
                        >
                          Ajouter
                        </button>
                      </div>
                      {campaignErrors[campaign.id] && (
                        <p className="mt-2 text-xs text-rose-400">
                          {campaignErrors[campaign.id]}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </>
      ) : (
        <>
          {renderTopHeader('Vue admin')}

          <main className="mx-auto max-w-lg pb-32">
            <section className="px-4 pt-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  className={`flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    adminSection === 'tables'
                      ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(208,187,149,0.35)]'
                      : 'text-slate-300'
                  }`}
                  onClick={() => setAdminSection('tables')}
                >
                  Tables
                </button>
                <button
                  className={`flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    adminSection === 'images'
                      ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(208,187,149,0.35)]'
                      : 'text-slate-300'
                  }`}
                  onClick={() => setAdminSection('images')}
                >
                  Images
                </button>
              </div>
            </section>

            {adminSection === 'tables' ? (
              <>
                <section className="px-4 pt-4">
                  <div className="flex items-center justify-between pb-2 pt-2">
                    <h3 className="text-lg font-bold tracking-tight">
                      Tables actuelles
                    </h3>
                    {loading && (
                      <span className="text-xs text-slate-400">
                        Chargement…
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {loading ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                        Chargement des tables…
                      </div>
                    ) : tables.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                        Aucune table pour le moment.
                      </div>
                    ) : (
                      tables.map((table) => {
                        const seatsLeft = Math.max(
                          0,
                          table.seatsTotal - table.seatsTaken,
                        )
                        const fillRate = table.seatsTotal
                          ? Math.round(
                              (table.seatsTaken / table.seatsTotal) * 100,
                            )
                          : 0
                        return (
                          <div
                            key={`admin-table-${table.id}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-base font-bold text-white">
                                  {table.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {formatDay(table.date)} • {table.time} • MJ:{' '}
                                  {table.gm}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-primary">
                                  {fillRate}%
                                </p>
                                <p className="text-xs text-slate-400">
                                  {seatsLeft} place
                                  {seatsLeft > 1 ? 's' : ''} restante
                                  {seatsLeft > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/10 bg-[#282520] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                {table.status === 'cancelled'
                                  ? 'Clôturée'
                                  : table.status === 'full'
                                    ? 'Complète'
                                    : 'Ouverte'}
                              </span>
                              <button
                                type="button"
                                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => handleCancelTable(table.id)}
                                disabled={table.status === 'cancelled'}
                              >
                                Clôturer
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-white/10 bg-[#282520] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300"
                                onClick={() => {
                                  setAdminChatOpen((prev) => ({
                                    ...prev,
                                    [table.id]: !prev[table.id],
                                  }))
                                  fetchChatForTable(table.id)
                                }}
                              >
                                {adminChatOpen[table.id]
                                  ? 'Masquer chat'
                                  : 'Voir chat'}
                              </button>
                            </div>
                            {adminChatOpen[table.id] && (
                              <div className="mt-3 rounded-xl border border-white/10 bg-[#1f1c17] p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Historique du chat
                                </p>
                                <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-[#191611] p-2">
                                  {(chatMessages[table.id] || []).length ===
                                  0 ? (
                                    <p className="text-xs text-slate-500">
                                      Aucun message pour le moment.
                                    </p>
                                  ) : (
                                    (chatMessages[table.id] || []).map(
                                      (message) => (
                                        <div
                                          key={message.id}
                                          className="flex items-center gap-2 text-xs"
                                        >
                                          {message.avatarUrl ? (
                                            <img
                                              src={message.avatarUrl}
                                              alt={message.author}
                                              className="size-5 rounded-full object-cover"
                                            />
                                          ) : (
                                            <span className="material-symbols-outlined text-[18px] text-slate-500">
                                              account_circle
                                            </span>
                                          )}
                                          <div>
                                            <span className="font-semibold text-white">
                                              {message.author}
                                            </span>
                                            <span className="text-slate-500">
                                              {' '}
                                              ·{' '}
                                            </span>
                                            <span className="text-slate-300">
                                              {message.text}
                                            </span>
                                          </div>
                                        </div>
                                      ),
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </section>

                <section className="px-4 pb-10 pt-6">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-lg font-bold tracking-tight">
                      Validation des joueurs
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {loading ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                        Chargement des demandes…
                      </div>
                    ) : tables.some((table) =>
                        (table.reservations || []).some(
                          (item) => item.status === 'pending',
                        ),
                      ) ? (
                      tables.map((table) => {
                        const pending = (table.reservations || []).filter(
                          (item) => item.status === 'pending',
                        )
                        if (pending.length === 0) {
                          return null
                        }
                        return (
                          <div
                            key={`admin-pending-${table.id}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {table.title}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {formatDay(table.date)} • {table.time} • MJ:{' '}
                                  {table.gm}
                                </p>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">
                                {pending.length} en attente
                              </span>
                            </div>
                            <div className="mt-3 flex flex-col gap-2">
                              {pending.map((player) => (
                                <div
                                  key={player.userId}
                                  className="flex items-center justify-between rounded-lg border border-white/10 bg-[#282520] px-3 py-2"
                                >
                                  <span className="text-xs text-white">
                                    {player.name}
                                  </span>
                                  <button
                                    className="rounded-full bg-[#D0BB95] px-3 py-1 text-xs font-bold text-background-dark"
                                    onClick={() =>
                                      handleValidate(
                                        table.id,
                                        player.userId,
                                      )
                                    }
                                  >
                                    Valider
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                        Aucune demande en attente.
                      </div>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <section className="px-4">
                <div className="flex items-center justify-between pb-2 pt-4">
                  <h3 className="text-lg font-bold tracking-tight">
                    Gestion des jeux
                  </h3>
                  {gamesLoading && (
                    <span className="text-xs text-slate-400">Chargement…</span>
                  )}
                </div>
                <form
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3"
                  onSubmit={handleCreateGame}
                >
                  <input
                    type="text"
                    className="h-10 flex-1 rounded-full border border-white/10 bg-[#282520] px-4 text-sm text-white"
                    placeholder="Nom du jeu"
                    value={newGameName}
                    onChange={(event) => setNewGameName(event.target.value)}
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-full bg-[#D0BB95] px-4 text-xs font-bold text-background-dark"
                  >
                    Ajouter
                  </button>
                </form>
                <div className="mt-4 flex flex-col gap-3">
                  {games.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                      Aucun jeu enregistré pour le moment.
                    </div>
                  ) : (
                    games.map((game) => (
                      <div
                        key={game.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-white">
                              {game.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {game.images?.length || 0} image(s)
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer rounded-full border border-white/10 bg-[#282520] px-3 py-1 text-xs font-semibold text-white">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                  const file = event.target.files?.[0]
                                  handleUploadGameImage(game.id, file, () => {
                                    event.target.value = ''
                                  })
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              className="rounded-full border border-rose-500/20 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400"
                              onClick={() => handleDeleteGame(game.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        {game.images?.length ? (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            {game.images.map((imageUrl) => (
                              <div
                                key={imageUrl}
                                className="overflow-hidden rounded-xl border border-white/10"
                              >
                                <img
                                  alt={`Vignette ${game.name}`}
                                  className="h-24 w-full object-cover"
                                  src={imageUrl}
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </main>

          <div className="pointer-events-none fixed -top-24 -left-24 size-64 bg-primary/10 blur-[100px]"></div>
          <div className="pointer-events-none fixed top-1/2 -right-24 size-48 bg-primary/5 blur-[80px]"></div>
        </>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background-dark/95 pb-6 pt-2 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2">
          <button
            className={`flex flex-col items-center gap-1 ${
              activeView === 'discover' ? 'text-[#D0BB95]' : 'text-slate-400'
            }`}
            onClick={() => setActiveView('discover')}
          >
            <span className="material-symbols-outlined text-[28px] fill-1">
              explore
            </span>
            <span className="text-[10px] font-bold uppercase">Accueil</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 ${
              activeView === 'gm' ? 'text-[#D0BB95]' : 'text-slate-400'
            }`}
            onClick={() => setActiveView('gm')}
          >
            <span className="material-symbols-outlined text-[28px]">book</span>
            <span className="text-[10px] font-bold uppercase">Mes tables</span>
          </button>
          <div className="relative -top-4">
            <button
              className="flex size-14 items-center justify-center rounded-full bg-[#F59E0B] text-background-dark shadow-[0_0_28px_rgba(245,158,11,0.55)]"
              onClick={handleOpenCreate}
            >
              <span className="material-symbols-outlined text-[32px] font-bold">
                add
              </span>
            </button>
          </div>
          <button
            className={`flex flex-col items-center gap-1 ${
              activeView === 'campaigns' ? 'text-[#D0BB95]' : 'text-slate-400'
            }`}
            onClick={() => setActiveView('campaigns')}
          >
            <span className="material-symbols-outlined text-[28px]">group</span>
            <span className="text-[10px] font-bold uppercase">Campagne</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 ${
              activeView === 'admin' ? 'text-[#D0BB95]' : 'text-slate-400'
            }`}
            onClick={() => {
              if (!user?.isAdmin) {
                window.alert('Accès admin réservé aux modérateurs.')
                return
              }
              setActiveView('admin')
            }}
          >
            <span className="material-symbols-outlined text-[28px]">
              settings
            </span>
            <span className="text-[10px] font-bold uppercase">Profil</span>
          </button>
        </div>
      </nav>
      {showCreateTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1d1a15] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Créer une table</h3>
              <button
                className="text-slate-400"
                onClick={() => setShowCreateTable(false)}
              >
                ✕
              </button>
            </div>
            <form className="mt-4 grid gap-3" onSubmit={handleCreateTable}>
              <label className="text-sm text-slate-300">
                Date
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.date}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="text-sm text-slate-300">
                Créneau horaire
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.time}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="text-sm text-slate-300">
                Jeu / univers
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.game}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      game: event.target.value,
                      image: '',
                    }))
                  }
                  placeholder="Ex: Donjons & Dragons 5e"
                  required
                />
              </label>
              {formState.game && (
                <div className="rounded-xl border border-white/10 bg-[#221f1a] p-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Aide à la saisie
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableGames
                      .filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(formState.game.toLowerCase()),
                      )
                      .map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className="rounded-full border border-white/10 bg-[#282520] px-3 py-1 text-xs font-semibold text-white"
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              game: item.name,
                              image: item.images?.[0] || '',
                            }))
                          }
                        >
                          {item.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {formState.game && (
                <div className="rounded-xl border border-white/10 bg-[#221f1a] p-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Vignettes disponibles
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {availableGames
                      .find(
                        (item) =>
                          item.name.toLowerCase() ===
                          formState.game.toLowerCase(),
                      )
                      ?.images?.map((imageUrl) => (
                        <button
                          key={imageUrl}
                          type="button"
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              image: imageUrl,
                            }))
                          }
                          className={`overflow-hidden rounded-xl border ${
                            formState.image === imageUrl
                              ? 'border-[#D0BB95]'
                              : 'border-white/10'
                          }`}
                        >
                          <img
                            alt="Vignette"
                            className="h-24 w-full object-cover"
                            src={imageUrl}
                          />
                        </button>
                      ))}
                  </div>
                </div>
              )}
              <label className="text-sm text-slate-300">
                Type de partie
                <select
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                >
                  <option value="initiation">initiation</option>
                  <option value="campagne">campagne</option>
                  <option value="one-shot">one-shot</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Nombre de places
                <input
                  type="number"
                  min="1"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.seatsTotal}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      seatsTotal: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="text-sm text-slate-300">
                Description courte
                <textarea
                  rows="3"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#282520] px-3 py-2 text-white"
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <button
                type="submit"
                disabled={creating}
                className="mt-2 flex h-11 items-center justify-center rounded-full bg-[#D0BB95] text-sm font-bold text-background-dark shadow-[0_0_20px_rgba(208,187,149,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating ? 'Création...' : 'Créer la table'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App



