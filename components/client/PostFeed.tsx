"use client"

import { Post } from "@/components/client/Post"
import { motion } from "framer-motion"

interface PostProps {
  author: string
  avatar: string
  content: string
  image?: string
  video?: string
  likes: number
  comments: number
  shares: number
}

const defaultPosts: PostProps[] = [
  {
    author: "CyberNinja",
    avatar: "/avatars/cyberninja.jpg",
    content:
      "Just cracked a **tough encryption** challenge! 🔓 Here's the Python script I used:\n\n```python\nimport hashlib\n\ndef crack_hash(hash_to_crack):\n    # Implementation details\n    pass\n\n# Usage\ncracked_password = crack_hash('abc123')\nprint(f'Cracked: {cracked_password}')\n```\n\n#cybersecurity #encryption",
    likes: 42,
    comments: 7,
    shares: 3,
  },
  {
    author: "CodeMaster",
    avatar: "/avatars/codemaster.jpg",
    content:
      "Check out this cool React hook I made for handling API requests:\n\n```jsx\nconst useApi = (url) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetchData();\n  }, [url]);\n\n  const fetchData = async () => {\n    try {\n      const response = await fetch(url);\n      const json = await response.json();\n      setData(json);\n    } catch (error) {\n      setError(error);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return { data, loading, error };\n};\n```\n\nWhat do you think? Any suggestions for improvement? 🤔 #reactjs #webdev",
    likes: 78,
    comments: 15,
    shares: 9,
  },
  {
    author: "HackMaster",
    avatar: "/avatars/hackmaster.jpg",
    content:
      "Just found a critical vulnerability in a popular web framework! 😱 Here's a simplified PoC:\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/vulnerable', (req, res) => {\n  const userInput = req.query.input;\n  res.send(`<script>${userInput}</script>`);\n});\n\napp.listen(3000, () => console.log('Vulnerable app running on port 3000'));\n```\n\nNever trust user input! Always sanitize and validate. #infosec #websecsecurity",
    likes: 105,
    comments: 23,
    shares: 17,
  },
]

export function PostFeed({ posts = defaultPosts }: { posts?: PostProps[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </motion.div>
  )
}

