export const encodeERC20TransferInputData = (
  to: string,
  amount: number,
  decimals: number
) => {
  // 4 bytes function signature of transfer(address,uint256) = a9059cbb
  // 32 bytes address parameter right aligned filled with zero bytes on the left
  // 32 bytes amount parameter
  const hexAmount = (amount * 10 ** decimals).toString(16)
  const padding = "0".repeat(64 - hexAmount.length)
  return `0xa9059cbb000000000000000000000000${to.slice(
    2
  )}${padding}${hexAmount}`
}
