import { useHandleRequest } from "../../hooks/useHandleRequest"
import "../../hooks/useWalletConnect"

import { useState } from "react"
import { encodeERC20TransferInputData } from "../../utils/encodeERC20Transfer"
import { validateAddress } from "../../utils/addressValidation"

interface Props {
  mechAddress: `0x${string}`
  tokenAddress: string
  balance: string
  decimals: number
}

const SendERC20Popup: React.FC<Props> = ({
  mechAddress,
  tokenAddress,
  balance,
  decimals,
}) => {
  const handleRequest = useHandleRequest(mechAddress)
  const [destinationAddress, setDestinationAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [destinationAddressError, setDestinationAddressError] = useState("")
  const [amountError, setAmountError] = useState("")

  // leaving DEBUG for the review
  console.log(`DEBUG mech address: ${mechAddress}`)
  console.log(`DEBUG token address: ${tokenAddress}`)
  console.log(`DEBUG decimals: ${decimals}`)
  console.log(`DEBUG to: ${destinationAddress}`)
  console.log(`DEBUG amount: ${amount}`)

  const handleSend = () => {
    // input validation to failfast
    const validAddress = validateAddress(destinationAddress)
    const inputAmount = parseFloat(amount)

    if (!validAddress) {
      setDestinationAddressError("Invalid destination address")
      return;
    }
    if (inputAmount * 10 ** decimals > parseInt(balance)) {
      setAmountError("Insufficient funds")
      return;
    }

    handleRequest({
      session: {
        topic: "sending ERC20",
      },
      request: {
        method: "eth_sendTransaction",
        params: [
          {
            data: encodeERC20TransferInputData(
              validAddress,
              inputAmount,
              decimals
            ),
            to: tokenAddress,
          },
        ],
      },
    })
  }

  return (
    <div className="popup">
      <h2>Send ERC20</h2>
      <div>
        <label htmlFor="destinationAddress">Destination Address</label>
        <input
          type="text"
          id="destinationAddress"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
        />
        {destinationAddressError && (
          <div className="error">{destinationAddressError}</div>
        )}
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {amountError && <div className="error">{amountError}</div>}
      </div>
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default SendERC20Popup
