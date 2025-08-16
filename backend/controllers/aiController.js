import dotenv from "dotenv"
dotenv.config()
import { OpenAI } from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// @desc    Student AI chat assistant
// @route   POST /api/ai/ask
// @access  Private (Student only)
export const askAI = async (req, res) => {
  try {
    const { question } = req.body

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" })
    }

    if (question.length > 1000) {
      return res.status(400).json({ message: "Question is too long. Maximum 1000 characters allowed." })
    }

    // Create a system prompt for educational assistance
    const systemPrompt = `You are an AI educational assistant helping students with their studies. 
    You should:
    - Provide helpful, accurate, and educational responses
    - Encourage learning and critical thinking
    - Ask follow-up questions when appropriate
    - Be supportive and motivating
    - Focus on explaining concepts rather than just giving answers
    - Keep responses concise but informative (max 500 words)
    - If asked to do homework directly, guide the student to understand the concepts instead
    
    Student's question: ${question}`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0].message.content

    res.json({
      success: true,
      data: {
        question,
        answer: aiResponse,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("AI ask error:", error)

    // Handle specific OpenAI errors
    if (error.code === "insufficient_quota") {
      return res.status(503).json({ message: "AI service temporarily unavailable. Please try again later." })
    }

    if (error.code === "rate_limit_exceeded") {
      return res.status(429).json({ message: "Too many requests. Please wait a moment and try again." })
    }

    res.status(500).json({ message: "Server error while processing AI request" })
  }
}

// @desc    Generate creative task via AI
// @route   POST /api/ai/generate-task
// @access  Private (Teacher only)
export const generateTask = async (req, res) => {
  try {
    const { subject, difficulty, taskType, additionalRequirements } = req.body

    // Validate required fields
    if (!subject || !difficulty || !taskType) {
      return res.status(400).json({
        message: "Subject, difficulty, and task type are required",
      })
    }

    // Validate difficulty level
    const validDifficulties = ["beginner", "intermediate", "advanced"]
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        message: "Difficulty must be one of: beginner, intermediate, advanced",
      })
    }

    // Validate task type
    const validTaskTypes = ["assignment", "project", "quiz", "essay", "presentation", "research", "practical"]
    if (!validTaskTypes.includes(taskType.toLowerCase())) {
      return res.status(400).json({
        message: "Task type must be one of: assignment, project, quiz, essay, presentation, research, practical",
      })
    }

    // Create a system prompt for task generation
    const systemPrompt = `You are an AI assistant helping teachers create educational tasks and assignments.
    
    Generate a creative and engaging ${taskType} for ${subject} at ${difficulty} level.
    
    Your response should include:
    1. A clear and engaging title
    2. Detailed description of the task (200-400 words)
    3. Specific learning objectives (3-5 objectives)
    4. Clear instructions for students
    5. Evaluation criteria or rubric points
    6. Suggested timeline/deadline (in days)
    7. Required resources or materials
    
    Additional requirements: ${additionalRequirements || "None specified"}
    
    Make the task:
    - Educationally valuable and aligned with learning goals
    - Engaging and motivating for students
    - Appropriate for the specified difficulty level
    - Clear and well-structured
    - Practical and achievable
    
    Format your response as a structured task description that a teacher can use directly.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.8,
    })

    const generatedTask = completion.choices[0].message.content

    res.json({
      success: true,
      message: "Task generated successfully",
      data: {
        generatedTask,
        parameters: {
          subject,
          difficulty,
          taskType,
          additionalRequirements,
        },
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("AI generate task error:", error)

    // Handle specific OpenAI errors
    if (error.code === "insufficient_quota") {
      return res.status(503).json({ message: "AI service temporarily unavailable. Please try again later." })
    }

    if (error.code === "rate_limit_exceeded") {
      return res.status(429).json({ message: "Too many requests. Please wait a moment and try again." })
    }

    res.status(500).json({ message: "Server error while generating task" })
  }
}

// @desc    Get AI usage statistics
// @route   GET /api/ai/stats
// @access  Private (Teacher only)
export const getAIStats = async (req, res) => {
  try {
    // This is a placeholder for AI usage statistics
    // In a real application, you would track AI API calls in a database
    res.json({
      success: true,
      data: {
        message: "AI statistics feature coming soon",
        note: "Track AI API usage, costs, and user interactions here",
      },
    })
  } catch (error) {
    console.error("Get AI stats error:", error)
    res.status(500).json({ message: "Server error while fetching AI statistics" })
  }
}
