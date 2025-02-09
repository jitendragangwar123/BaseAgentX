'use client'

import { useState } from 'react'
import { Loader2, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react'
import ChatBox from '../ChatBox';

interface Step {
  number: number
  title: string
  description: string
  status: 'pending' | 'loading' | 'complete' | 'error'
  txHash?: string
}

interface SuccessMessage {
  show: boolean
  message: string
}

const MoonStrategy = () => {
  const [initialAmount, setInitialAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ show: false, message: '' })
  const [steps, setSteps] = useState<Step[]>([
    { number: 1, title: 'Acquire Carbon Credits', description: 'Purchase tokenized carbon credits via KlimaDAO', status: 'pending' },
    { number: 2, title: 'Stake for Yield', description: 'Stake acquired carbon credits to generate passive yield', status: 'pending' },
    { number: 3, title: 'Leverage for Expansion', description: 'Use staked carbon credits as collateral to acquire more credits', status: 'pending' }
  ])

  const updateStepStatus = (stepNumber: number, status: Step['status'], txHash?: string) => {
    setSteps(prevSteps => prevSteps.map(step =>
      step.number === stepNumber ? { ...step, status, txHash } : step
    ))
  }

  const executeStep = async (stepNumber: number, amount: string, action: string) => {
    updateStepStatus(stepNumber, 'loading')
    try {
      const response = await fetch('/api/carbon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Failed step ${stepNumber}`)
      updateStepStatus(stepNumber, 'complete', data.txHash)
      return data
    } catch (err: any) {
      updateStepStatus(stepNumber, 'error')
      throw err
    }
  }

  const handleStartStrategy = async () => {
    if (!initialAmount || isLoading) return
    setIsLoading(true)
    setError(null)
    setSuccessMessage({ show: false, message: '' })
    try {
      await executeStep(1, initialAmount, 'acquire')
      await executeStep(2, initialAmount, 'stake')
      await executeStep(3, initialAmount, 'leverage')
      setSuccessMessage({ show: true, message: '🚀 Moon Strategy executed successfully!' })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-700 via-blue-800 to-purple-900 text-white p-8 font-arcade relative overflow-hidden mt-16">
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent blur-3xl"></div>
      
      <div className="max-w-3xl w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative p-8 border border-gray-700">
        <div className="relative h-48 bg-gradient-to-r from-purple-700 to-purple-900 p-8 flex flex-col justify-center rounded-t-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Moon Strategy</h1>
          <p className="text-purple-200 text-lg mt-2">Leverage tokenized carbon credits for DeFi yield optimization.</p>
        </div>

        <div className="p-8 space-y-6">
          {steps.map(step => (
            <div key={step.number} className="p-4 rounded-lg border border-gray-700 bg-gray-800 shadow-md">
              <div className="flex items-center">
                {step.status === 'loading' && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
                {step.status === 'complete' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-white">Step {step.number}: {step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-300">Amount (KLIMA)</label>
            <input type="number" value={initialAmount} onChange={e => setInitialAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 focus:border-purple-400 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-sm" placeholder="Enter KLIMA amount" />
            
            <button onClick={handleStartStrategy} disabled={isLoading || !initialAmount || parseFloat(initialAmount) <= 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Executing Strategy...
                </>
              ) : (
                'Start Strategy'
              )}
            </button>
          </div>

          {error && <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mt-4 shadow-md">{error}</div>}
          {successMessage.show && <div className="p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg text-purple-300 mt-4 shadow-md">{successMessage.message}</div>}
        </div>
      </div>
      
      <button onClick={() => setIsChatOpen(!isChatOpen)} className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300">
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
      
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} strategy="moon" />
    </div>
  )
}

export default MoonStrategy;
