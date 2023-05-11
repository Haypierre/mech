import React from "react"
import { useParams } from "react-router-dom"
import { useChainId } from "wagmi"
import Layout from "../../components/Layout"
import useNFT from "../../hooks/useNFT"
import NFTItem from "../../components/NFTItem"

import classes from "./Mech.module.css"
import Spinner from "../../components/Spinner"
import MechConnect from "../../components/Connect"
import { ProvideWalletConnect } from "../../hooks/useWalletConnect"
import { useHandleRequest } from "../../hooks/useHandleRequest"
import { useDeployMech } from "../../hooks/useDeployMech"
import MechDeploy from "../../components/Deploy"
import { calculateMechAddress } from "../../utils/calculateMechAddress"
import { CHAINS } from "../../chains"

const Mech: React.FC = () => {
  const { token, tokenId } = useParams()

  if (!token || !tokenId) {
    throw new Error("token and tokenId are required")
  }

  const [chainPrefix, contractAddress] = token.split(":")
  const chain = CHAINS.find((c) => c.prefix === chainPrefix)

  if (!chain) {
    throw new Error(`chain ${chainPrefix} not support`)
  }

  if (!token.startsWith("0x")) {
    throw new Error("token must be a valid address")
  }

  const { data, error, isLoading } = useNFT({
    contractAddress,
    tokenId: tokenId,
    blockchain: chain.shortChainID,
  })

  const { deployed, deploy, deployPending } = useDeployMech(data)

  const mechAddress = data && calculateMechAddress(data)

  const handleRequest = useHandleRequest(mechAddress)

  return (
    <Layout mechAddress={mechAddress || undefined}>
      <div className={classes.container}>
        {isLoading && <Spinner />}
        {!error && !isLoading && data && mechAddress && (
          <>
            <NFTItem nftData={data} />

            <ProvideWalletConnect
              chainId={parseInt(chain.chainID)}
              mechAddress={mechAddress}
              onRequest={handleRequest}
            >
              {deployed && <MechConnect />}
              {!deployed && (
                <MechDeploy deploy={deploy} deployPending={deployPending} />
              )}
            </ProvideWalletConnect>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Mech
