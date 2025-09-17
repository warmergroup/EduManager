import { SubscriptionPlan } from '../models/SubscriptionPlan.js'

// @desc    Get all subscription plans
// @route   GET /api/subscription-plans
// @access  Private
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ price: 1 })

    res.json({
      success: true,
      data: { plans }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans',
      error: error.message
    })
  }
}

// @desc    Get subscription plan by ID
// @route   GET /api/subscription-plans/:id
// @access  Private
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await SubscriptionPlan.findById(id)
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      })
    }

    res.json({
      success: true,
      data: { plan }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plan',
      error: error.message
    })
  }
}

// @desc    Create new subscription plan
// @route   POST /api/subscription-plans
// @access  Private (Super Admin only)
export const createPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: { plan }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription plan',
      error: error.message
    })
  }
}

// @desc    Update subscription plan
// @route   PUT /api/subscription-plans/:id
// @access  Private (Super Admin only)
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      })
    }

    res.json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: { plan }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscription plan',
      error: error.message
    })
  }
}

// @desc    Delete subscription plan
// @route   DELETE /api/subscription-plans/:id
// @access  Private (Super Admin only)
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await SubscriptionPlan.findByIdAndDelete(id)
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      })
    }

    res.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription plan',
      error: error.message
    })
  }
}
