'use client'

import { useState } from 'react'
import { Loader2, MessageCircle } from 'lucide-react'
import ChatBox from '../ChatBox'

const BearishStrategy = () => {
    const [amount, setAmount] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
  
    const handleSupply = async () => {
      if (!amount || isLoading) return
  
      setIsLoading(true)
      setError(null)
      setResult(null)
  
      try {
        const response = await fetch('/api/klima', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'supply',
            amount: amount
          }),
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("API Response:", data)
        setResult(data)
      } catch (err: unknown) {
        console.error("Error:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An error occurred while supplying carbon credits')
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-700 via-blue-800 to-purple-900 text-white p-8 font-arcade relative overflow-hidden mt-10">
        <div className="absolute inset-0 bg-gradient-radial from-red-500/20 to-transparent blur-3xl"></div>
        
        <div className="max-w-3xl w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative p-8 border border-gray-700">
          <div className="relative h-48 bg-gradient-to-r from-red-700 to-red-900 p-8 flex flex-col justify-center rounded-t-2xl shadow-md">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Bearish Strategy</h1>
            <p className="text-red-200 text-lg mt-2">Supply carbon credits via KlimaDAO for sustainable returns</p>
          </div>

          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-red-400">Supply Carbon Credits</h2>
            <p className="text-gray-300 leading-relaxed">
              Contribute your carbon credits to KlimaDAO's liquidity pool and earn rewards while supporting sustainability.
            </p>
            
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-300">Amount (KLIMA)</label>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-600 focus:border-red-400 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter KLIMA amount"
                min="0"
                step="0.01"
              />
  
              <button
                onClick={handleSupply}
                disabled={isLoading || !amount || parseFloat(amount) <= 0}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Supplying...
                  </>
                ) : (
                  'Supply KLIMA'
                )}
              </button>
            </div>
  
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mt-4 shadow-md">
                {error}
              </div>
            )}
  
            {result && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mt-4 shadow-md">
                Transaction Successful! {JSON.stringify(result)}
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        <ChatBox 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          strategy="bearish"
        />
      </div>
    )
};

export default BearishStrategy;