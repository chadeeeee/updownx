import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useAuth } from "../../lib/auth";
import { api, ApiError } from "../../lib/api";
import { Globe, Search, X, ChevronDown, Menu, Plus } from "lucide-react";
import { Cryptocon } from "cryptocons";

/* ═══════════════════════ Types ═══════════════════════ */
type Position = {
  id: number; side: "long" | "short"; symbol: string; pair: string;
  entryPrice: number; sizeUsdt: number; leverage: number; margin: number; liqPrice: number; openTime: number;
  takeProfit?: number | null; stopLoss?: number | null;
};
type PendingOrder = {
  id: number; type: "limit" | "trigger"; side: "long" | "short"; symbol: string; pair: string;
  price: number; triggerPrice?: number; execType?: "limit" | "market"; sizeUsdt: number; leverage: number; margin: number; createdAt: number;
  triggerDirection?: "up" | "down";
};
type OrderHist = {
  id: number; type: "limit" | "trigger" | "market"; side: "long" | "short"; symbol: string;
  price: number; sizeUsdt: number; leverage: number; status: "filled" | "cancelled"; createdAt: number; filledAt?: number;
};
type TradeHist = {
  id: number; side: "long" | "short"; symbol: string; entryPrice: number; exitPrice: number;
  sizeUsdt: number; leverage: number; pnl: number; openedAt: number; closedAt: number;
};
type CoinDef = { symbol: string; name: string; pair: string; color: string };

/* ═══════════════════════ Coin Data ═══════════════════════ */
const RAW: [string,string,string][] = [
  ["BTC","Bitcoin","#f7931a"],["ETH","Ethereum","#627eea"],["BNB","BNB","#f3ba2f"],
  ["SOL","Solana","#9945ff"],["XRP","XRP","#23292f"],["ADA","Cardano","#0033ad"],
  ["DOGE","Dogecoin","#c2a633"],["TON","Toncoin","#0098ea"],["TRX","TRON","#ff0013"],
  ["AVAX","Avalanche","#e84142"],["SHIB","Shiba Inu","#ffa409"],["DOT","Polkadot","#e6007a"],
  ["LINK","Chainlink","#2a5ada"],["BCH","Bitcoin Cash","#8dc351"],["MATIC","Polygon","#8247e5"],
  ["LTC","Litecoin","#bfbbbb"],["ICP","Internet Computer","#29abe2"],["UNI","Uniswap","#ff007a"],
  ["XLM","Stellar","#14b6e7"],["ATOM","Cosmos","#2e3148"],["ETC","Ethereum Classic","#328332"],
  ["HBAR","Hedera","#4d4d4d"],["FIL","Filecoin","#0090ff"],["APT","Aptos","#4dc9a0"],
  ["ARB","Arbitrum","#28a0f0"],["VET","VeChain","#15bdff"],["CRO","Cronos","#002d74"],
  ["NEAR","NEAR Protocol","#00c08b"],["ALGO","Algorand","#6d6d6d"],["QNT","Quant","#585858"],
  ["MNT","Mantle","#5b5b5b"],["OP","Optimism","#ff0420"],["GRT","The Graph","#6747ed"],
  ["MKR","Maker","#1aaa9b"],["AAVE","Aave","#b6509e"],["KAS","Kaspa","#49eacb"],
  ["RNDR","Render","#4da6ff"],["IMX","Immutable","#1a8cff"],["RPL","Rocket Pool","#ff6b35"],
  ["INJ","Injective","#0082ff"],["FTM","Fantom","#1969ff"],["EGLD","MultiversX","#23f7dd"],
  ["SEI","Sei","#9b1c1c"],["SUI","Sui","#6fbcf0"],["STX","Stacks","#5546ff"],
  ["FLOW","Flow","#00ef8b"],["XTZ","Tezos","#a6e000"],["THETA","Theta Network","#2ab8e6"],
  ["MANA","Decentraland","#ff2d55"],["SAND","Sandbox","#04b4e0"],["AXS","Axie Infinity","#0055d5"],
  ["GALA","Gala","#4c4c4c"],["CHZ","Chiliz","#cd0124"],["EOS","EOS","#443f53"],
  ["NEO","Neo","#00e599"],["ZEC","Zcash","#ecb244"],["DASH","Dash","#008de4"],
  ["IOTA","IOTA","#242424"],["WAVES","Waves","#0055ff"],["KAVA","Kava","#ff564f"],
  ["HNT","Helium","#474dff"],["MINA","Mina","#e49b13"],["CFX","Conflux","#1a1a2e"],
  ["LRC","Loopring","#1c60ff"],["BAT","Basic Attention Token","#ff5000"],["ENJ","Enjin Coin","#7866d5"],
  ["ZIL","Zilliqa","#49c1bf"],["QTUM","Qtum","#2e9ad0"],["ONE","Harmony","#00aee9"],
  ["CKB","Nervos Network","#3cc68a"],["ROSE","Oasis Network","#0092f6"],["1INCH","1inch","#94a6c3"],
  ["CRV","Curve DAO Token","#a3001e"],["SNX","Synthetix","#00d1ff"],["BAL","Balancer","#1e1e1e"],
  ["YFI","Yearn Finance","#006ae3"],["COMP","Compound","#00d395"],["GMX","GMX","#2d42fc"],
  ["DYDX","dYdX","#6966ff"],["CAKE","PancakeSwap","#d1884f"],["TWT","Trust Wallet Token","#3375bb"],
  ["LUNC","Terra Classic","#ebb22e"],["LUNA","Terra","#172852"],["RON","Ronin","#1273ea"],
  ["AR","Arweave","#222326"],["WOO","WOO Network","#21242b"],["RVN","Ravencoin","#384182"],
  ["ICX","ICON","#1fc5c9"],["AUDIO","Audius","#cc0fe0"],["ANKR","Ankr","#2e6bf6"],
  ["LPT","Livepeer","#00eb88"],["API3","API3","#5b3ddd"],["BAND","Band Protocol","#516aff"],
  ["CELO","Celo","#35d07f"],["RSR","Reserve Rights","#333"],["SKL","SKALE","#444"],
  ["OCEAN","Ocean Protocol","#555"],["FLUX","Flux","#2b61d1"],["USDC","USD Coin","#2775ca"],
];
const COINS: CoinDef[] = RAW.map(([s,n,c]) => ({ symbol:s, name:n, pair:`${s}USDT`, color:c }));
const MM_RATE = 0.004; // 0.4% maintenance margin rate

const SYMBOL_TO_ICON: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "Binance",
  SOL: "Solana",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  DOT: "Polkadot",
  MATIC: "Polygon",
  AVAX: "Avalanche",
  LINK: "Chainlink",
  UNI: "Uniswap",
  ATOM: "Cosmos",
  LTC: "Litecoin",
  ETC: "EthereumClassic",
  ALGO: "Algorand",
  XLM: "Stellar",
  BCH: "BitcoinCash",
  FIL: "FileCoin",
  TRX: "Tron",
  EOS: "Eosio",
  XTZ: "Tezos",
  AAVE: "Aave",
  MKR: "Maker",
  COMP: "Compound",
  SNX: "Synthetix",
  YFI: "Yearn",
  SUSHI: "SushiSwap",
  CRV: "Curve",
  BAT: "BasicAttentionToken",
  ZEC: "ZCash",
  DASH: "Dash",
  GRT: "Graph",
  "1INCH": "OneInch",
  SHIB: "ShibaInu",
  MANA: "Decentraland",
  GALA: "Gala",
  HBAR: "Hedera",
  FTM: "Fantom",
  FLOW: "Flow",
  VET: "VeChain",
  THETA: "Theta",
  KAVA: "Kava",
  ZIL: "Zilliqa",
  ONE: "Harmony",
  CKB: "Nervos",
  ANKR: "Ankr",
  LPT: "LivePeer",
  QTUM: "Qtum",
  WAVES: "Waves",
  RVN: "Ravencoin",
  CELO: "Celo",
  AR: "Arweave",
  MINA: "Mina",
  STX: "Stacks",
  LRC: "Loopring",
  CAKE: "Pancakeswap",
  USDT: "Tether",
  IMX: "ImmutableX",
  INJ: "Injective",
  RSR: "Reserve",
  ICX: "Icon",
  BAL: "Bancor", // Close enough fallback if Balancer is missing
  CHZ: "Chiliz",
  OCEAN: "Ocean",
  FLUX: "Flux",
  BUSD: "BinanceUsd",
  DAI: "Dai",
  MASK: "MetaMask",
  AUDIO: "Audius",
  API3: "Api3",
  BAND: "Band",
  NEO: "Neo",
  IOTA: "Iota",
  QNT: "Quant",
  LUNA: "Terra",
};

// Safety list of all valid LogoNames from cryptocons to prevent rendering crashes
const VALID_ICONS = new Set([
  "Abbc", "AbbcBadge", "AcalaNetwork", "AcalaNetworkBadge", "Achain", "AchainBadge", "Adcoin", "AdcoinBadge", "AidosKuneen", "AidosKuneenBadge", "Aion", "AionBadge", "Akropolis", "AkropolisBadge", "Algorand", "AlgorandBadge", "AlphaWallet", "AlphaWalletBadge", "Alqo", "AlqoBadge", "Ampleforth", "AmpleforthBadge", "AnchorProtocol", "AnchorProtocolBadge", "Ankr", "AnkrBadge", "ApeNft", "ApeNftBadge", "ApolloCurrency", "ApolloCurrencyBadge", "AppCoins", "AppCoinsBadge", "Arweave", "ArweaveBadge", "Avalanche", "AvalancheBadge", "BLThreeP", "BLThreePBadge", "Bancor", "BancorBadge", "BanklessTimes", "BanklessTimesBadge", "BasicAttentionToken", "BasicAttentionTokenBadge", "Beam", "BeamBadge", "BeanCash", "BeanCashBadge", "Biconomy", "BiconomyBadge", "Binance", "BinanceBadge", "BinanceSmartChain", "BinanceSmartChainBadge", "BinanceUsd", "BinanceUsdBadge", "BitMart", "BitMartBadge", "Bitbank", "BitbankBadge", "Bitcoin", "BitcoinBadge", "BitcoinCash", "BitcoinCashBadge", "BitcoinPlus", "BitcoinPlusBadge", "BitcoinPrivate", "BitcoinPrivateBadge", "BitcoinWrapped", "BitcoinWrappedBadge", "Bitcore", "BitcoreBadge", "Bitfinex", "BitfinexBadge", "Bitflyer", "BitflyerBadge", "Bitglobal", "BitglobalBadge", "Bithumb", "BithumbBadge", "Bitpanda", "BitpandaBadge", "Bitrue", "BitrueBadge", "Bitstamp", "BitstampBadge", "Bittrex", "BittrexBadge", "Bitvavo", "BitvavoBadge", "Blackmoon", "BlackmoonBadge", "BlockFi", "BlockFiBadge", "Braintrust", "BraintrustBadge", "Brave", "BraveBadge", "Cardano", "CardanoBadge", "Casper", "CasperBadge", "Celo", "CeloBadge", "Celsius", "CelsiusBadge", "Centrifuge", "CentrifugeBadge", "CertusOne", "CertusOneBadge", "Cex", "CexBadge", "Chainlink", "ChainlinkBadge", "ChangellyPro", "ChangellyProBadge", "CoinDesk", "CoinDeskBadge", "CoinGecko", "CoinGeckoBadge", "CoinMarketCap", "CoinMarketCapBadge", "CoinTiger", "CoinTigerBadge", "Coinbase", "CoinbaseBadge", "Coinone", "CoinoneBadge", "Coinranking", "CoinrankingBadge", "Coinwink", "CoinwinkBadge", "Compound", "CompoundBadge", "Consensys", "ConsensysBadge", "ConsensysCodefi", "ConsensysCodefiBadge", "Convex", "ConvexBadge", "Core", "CoreBadge", "CoreToken", "CoreTokenBadge", "Cortex", "CortexBadge", "Cosmos", "CosmosBadge", "Coti", "CotiBadge", "Covalent", "CovalentBadge", "Cream", "CreamBadge", "CryptoCom", "CryptoComBadge", "CurrencyCom", "CurrencyComBadge", "Curve", "CurveBadge", "Dash", "DashBadge", "Decentraland", "DecentralandBadge", "Decred", "DecredBadge", "DefiCoins", "DefiCoinsBadge", "Digibyte", "DigibyteBadge", "Digifinex", "DigifinexBadge", "DigitalReserve", "DigitalReserveBadge", "Discord", "DiscordBadge", "DockDock", "DockDockBadge", "Dogecoin", "DogecoinBadge", "ECash", "ECashBadge", "Efinity", "EfinityBadge", "Ens", "EnsBadge", "Eosio", "EosioBadge", "Ethereum", "EthereumBadge", "EthereumClassic", "EthereumClassicBadge", "Etoro", "EtoroBadge", "Fei", "FeiBadge", "FileCoin", "FileCoinBadge", "Flow", "FlowBadge", "Flux", "FluxBadge", "Ftx", "FtxBadge", "Gala", "GalaBadge", "GateIo", "GateIoBadge", "Gemini", "GeminiBadge", "GitHub", "GitHubBadge", "Gitcoin", "GitcoinBadge", "Gnosis", "GnosisBadge", "Graph", "GraphBadge", "Harmony", "HarmonyBadge", "Hedera", "HederaBadge", "Hex", "HexBadge", "Hive", "HiveBadge", "Holo", "HoloBadge", "Horizen", "HorizenBadge", "HuobiGlobal", "HuobiGlobalBadge", "HushHush", "HushHushBadge", "ImmutableX", "ImmutableXBadge", "Indodax", "IndodaxBadge", "Infura", "InfuraBadge", "Injective", "InjectiveBadge", "Iota", "IotaBadge", "Iotex", "IotexBadge", "Iqeon", "IqeonBadge", "Iris", "IrisBadge", "Kadena", "KadenaBadge", "Kambria", "KambriaBadge", "Kava", "KavaBadge", "KeepNetwork", "KeepNetworkBadge", "KeeperDao", "KeeperDaoBadge", "Kraken", "KrakenBadge", "Ksm", "KsmBadge", "Kucoin", "KucoinBadge", "KusamaBadge", "LBank", "LBankBadge", "Ledger", "LedgerBadge", "Lido", "LidoBadge", "Liquid", "LiquidBadge", "Litecoin", "LitecoinBadge", "LivePeer", "LivePeerBadge", "Loopring", "LoopringBadge", "Luno", "LunoBadge", "MathWallet", "MathWalletBadge", "Medibloc", "MediblocBadge", "Meetone", "MeetoneBadge", "MetaMask", "MetaMaskBadge", "Mina", "MinaBadge", "Mint", "MintBadge", "Monero", "MoneroBadge", "Multiavatar", "MultiavatarBadge", "MyCrypto", "MyCryptoBadge", "NCash", "NCashBadge", "NGrave", "NGraveBadge", "Nav", "NavBadge", "Nebeus", "NebeusBadge", "Nem", "NemBadge", "Neo", "NeoBadge", "Nervos", "NervosBadge", "Nexo", "NexoBadge", "NftLaunchpad", "NftLaunchpadBadge", "Nftx", "NftxBadge", "Ngc", "NgcBadge", "Nym", "NymBadge", "Ocean", "OceanBadge", "OkCash", "OkCashBadge", "Okcoin", "OkcoinBadge", "Okex", "OkexBadge", "Okx", "OkxBadge", "Omg", "OmgBadge", "Omisego", "OmisegoBadge", "OneInch", "OneInchBadge", "OpenDao", "OpenDaoBadge", "Origin", "OriginBadge", "Pancakeswap", "PancakeswapBadge", "Parsiq", "ParsiqBadge", "Part", "PartBadge", "Paxos", "PaxosBadge", "Paybis", "PaybisBadge", "Phantom", "PhantomBadge", "Pillar", "PillarBadge", "Ping", "PingBadge", "Pinkcoin", "PinkcoinBadge", "Pivx", "PivxBadge", "Polkadot", "PolkadotBadge", "Poloniex", "PoloniexBadge", "Polygon", "PolygonBadge", "Polymath", "PolymathBadge", "Presearch", "PresearchBadge", "Pril", "PrilBadge", "Probit", "ProbitBadge", "ProjectGalaxy", "ProjectGalaxyBadge", "Qtum", "QtumBadge", "Quant", "QuantBadge", "QuantStamp", "QuantStampBadge", "Quorum", "QuorumBadge", "Ravencoin", "RavencoinBadge", "Reef", "ReefBadge", "Refereum", "RefereumBadge", "RenRen", "RenRenBadge", "Request", "RequestBadge", "Reserve", "ReserveBadge", "Revain", "RevainBadge", "Ripio", "RipioBadge", "Rise", "RiseBadge", "Secret", "SecretBadge", "Serum", "SerumBadge", "ShibaInu", "ShibaInuBadge", "SigmaPrime", "SigmaPrimeBadge", "Solana", "SolanaBadge", "Stacks", "StacksBadge", "Stakenet", "StakenetBadge", "Startcoin", "StartcoinBadge", "Status", "StatusBadge", "Steem", "SteemBadge", "Stellar", "StellarBadge", "SushiSwap", "SushiSwapBadge", "Suterusu", "SuterusuBadge", "SwarmCity", "SwarmCityBadge", "Symbol", "Synthetix", "SynthetixBadge", "Syscoin", "SyscoinBadge", "Tenx", "TenxBadge", "Terarium", "TerariumBadge", "Terra", "TerraBadge", "Tether", "TetherBadge", "TetherGold", "TetherGoldBadge", "Tezos", "TezosBadge", "Theta", "ThetaBadge", "ThetaFuel", "ThetaFuelBadge", "ThorChain", "ThorChainBadge", "Trezor", "TrezorBadge", "Tron", "TronBadge", "TrueUsd", "TrueUsdBadge", "Truffle", "TruffleBadge", "Uma", "UmaBadge", "Uniswap", "UniswapBadge", "UnstoppableDomains", "UnstoppableDomainsBadge", "Upbit", "UpbitBadge", "Uphold", "UpholdBadge", "Varen", "VarenBadge", "VeChain", "VeChainBadge", "Vega", "VegaBadge", "Velas", "VelasBadge", "VenusReward", "VenusRewardBadge", "Verasity", "VerasityBadge", "Verus", "VerusBadge", "Waves", "WavesBadge", "WazirX", "WazirXBadge", "XMark", "XMarkBadge", "Xensor", "XensorBadge", "Xmx", "XmxBadge", "Yearn", "YearnBadge", "ZCash", "ZCashBadge", "Zapper", "ZapperBadge", "Zb", "ZbBadge", "Zcoin", "ZcoinBadge", "ZebPay", "ZebPayBadge", "ZeroCollateralDai", "ZeroX", "Zilliqa"
]);

/* ═══════════════════════ Custom Icons Override ═══════════════════════ */
// Insert your own custom image paths here for any coin. e.g. "XRP": "/images/icons/xrp.png"
// This will override both the cryptocons library and the external CDN fallback.
const CUSTOM_ICONS: Record<string, string> = {
  TON: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/17980/large/photo_2024-09-10_17.09.00.jpeg?1725963446",
  APT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/26455/large/Aptos-Network-Symbol-Black-RGB-1x.png?1761789140&bg=white",
  ARB: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242",
  CRO: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/7310/large/cro_token_logo.png?1696507599",
  NEAR: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/10365/large/near.jpg?1696510367",
  MNT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/30980/large/MNT_Token_Logo.png?1765516974",
  OP: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/25244/large/Token.png?1774456081",
  KAS: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/25751/large/kaspa-icon-exchanges.png?1696524837",
  RNDR: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/11636/large/rndr.png?1696511529",
  RPL: "https://images.weserv.nl/?url=raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD33526068D116cE69F19A9ee46F0bd304F21A51f/logo.png",
  EGLD: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12335/large/egld-token-logo.png?1696512162",
  SEI: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png?1696527207",
  SUI: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
  AXS: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/13029/large/axie_infinity_logo.png?1696512817",
  HNT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/4284/large/helium_logo_use.png?1748092589",
  CFX: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/13079/large/3vuYMbjN.png?1696512867&bg=white",
  ROSE: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/13162/large/200x200_%28Rounded%29.png?1743579893",
  GMX: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/18323/large/arbit.png?1696517814",
  DYDX: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/32594/large/dydx.png?1698673495",
  TWT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/11085/large/Trust.png?1696511026",
  LUNC: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/8284/large/01_LunaClassic_color.png?1696508486",
  RON: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/20009/large/photo_2024-04-06_22-52-24.jpg?1712415367",
  WOO: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12921/large/WOO_Logos_2023_Profile_Pic_WOO.png?1696512709",
  FTM: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/4001/large/Fantom_round.png?1696504642",
  AUDIO: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12913/large/audio-token-asset_2x.png?1747243328",
  API3: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/13256/large/Api3-Token.png?1742439807",
  IOTA: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/692/large/IOTA_Thumbnail_%281%29.png?1743772896",
  LUNA: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/25767/large/01_Luna_color.png?1696524851",
  OCEAN: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/3687/large/ocean-protocol-logo.jpg?1696504363",
  SOL: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
  XLM: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/100/large/fmpFRHHQ_400x400.jpg?1735231350",
  VET: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/1167/large/VET.png?1742383283",
  ALGO: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/4380/large/download.png?1696504978",
  QNT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg?1696504070",
  DOT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12171/large/polkadot.jpg?1766533446",
  INJ: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12882/large/Other_200x200.png?1738782212",
  THETA: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/2538/large/theta-token-logo.png?1696503349",
  GALA: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/12493/large/GALA_token_image_-_200PNG.png?1709725869",
  ONE: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/4344/large/Y88JAze.png?1696504947",
  BAL: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/11683/large/Balancer.png&bg=white",
  LPT: "https://images.weserv.nl/?url=coin-images.coingecko.com/coins/images/7137/large/badge-logo-circuit-green.png?1719357686"
};

/* ═══════════════════════ Helpers ═══════════════════════ */
const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtDate = (t: number) => new Date(t).toLocaleString("en-GB", { timeZone: "Europe/Kiev", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const calcLiqPrice = (entry: number, leverage: number, side: "long"|"short") =>
  side === "long" ? entry * (1 - 1/leverage + MM_RATE) : entry * (1 + 1/leverage - MM_RATE);

const calcPnl = (pos: Position, markPrice: number) =>
  pos.side === "long"
    ? pos.sizeUsdt * (markPrice - pos.entryPrice) / pos.entryPrice
    : pos.sizeUsdt * (pos.entryPrice - markPrice) / pos.entryPrice;

const calcRoiFromPrice = (pos: Position, targetPrice: number) => {
  const ratio = pos.side === "long"
    ? (targetPrice - pos.entryPrice) / pos.entryPrice
    : (pos.entryPrice - targetPrice) / pos.entryPrice;
  return ratio * pos.leverage * 100;
};

/* ═══════════════════════ Sub-components ═══════════════════════ */
const GradientBorderPanel = ({ children, width, className = "" }: { children: React.ReactNode; width?: string; className?: string }) => (
  <div className={`p-[1px] rounded-[12px] bg-gradient-to-b from-[#2CF6C3] to-[#013226] shrink-0 flex flex-col ${className}`} style={{ width }}>
    <div className="bg-[#05070A] rounded-[11px] w-full h-full flex flex-col overflow-hidden relative">{children}</div>
  </div>
);

const CoinIcon = ({ symbol, color, size = 20 }: { symbol: string; color?: string; size?: number }) => {
  const [customError, setCustomError] = useState(false);
  const [cdnError, setCdnError] = useState(false);
  
  if (CUSTOM_ICONS[symbol] && !customError) {
    return (
      <img
        src={CUSTOM_ICONS[symbol]}
        alt={symbol}
        width={size}
        height={size}
        className="rounded-full shrink-0 object-contain"
        onError={() => setCustomError(true)}
      />
    );
  }

  const iconName = SYMBOL_TO_ICON[symbol];

  if (iconName && VALID_ICONS.has(iconName)) {
    return (
      <div style={{ width: size, height: size }} className="shrink-0 flex items-center justify-center opacity-90 transition-opacity">
        <Cryptocon icon={iconName as any} size={size} />
      </div>
    );
  }

  if (!cdnError) {
    return (
      <img
        src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${symbol.toLowerCase()}.svg`}
        alt={symbol}
        width={size}
        height={size}
        className="rounded-full shrink-0"
        onError={() => setCdnError(true)}
      />
    );
  }

  return (
    <div 
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0 border border-white/10"
      style={{ width: size, height: size, backgroundColor: color || "#16212b", fontSize: size * 0.5 }}
    >
      {symbol[0]}
    </div>
  );
};

const scrollbarCls = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full";

/* ═══════════════════════ Main Component ═══════════════════════ */
export const ControlPanel = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "Trader";
  const initials = displayName.split(/\s+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);

  /* ─── State ─── */
  const [orderType, setOrderType] = useState<"Limit"|"Market"|"Trigger">("Market");
  const [bottomTab, setBottomTab] = useState("positions");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [percent, setPercent] = useState(0);
  const [orderBookView, setOrderBookView] = useState<"both"|"bids"|"asks">("both");
  const [marginType, setMarginType] = useState<"CROSS"|"ISOLATED">("CROSS");
  const [marginDropdownOpen, setMarginDropdownOpen] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const [leverageDropdownOpen, setLeverageDropdownOpen] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [triggerPriceInput, setTriggerPriceInput] = useState("");
  const [triggerExecType, setTriggerExecType] = useState<"Limit"|"Market">("Limit");
  const [triggerExecDropdownOpen, setTriggerExecDropdownOpen] = useState(false);
  const [sizeInput, setSizeInput] = useState("");

  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [coinSelectorOpen, setCoinSelectorOpen] = useState(false);
  const [coinSearch, setCoinSearch] = useState("");
  const coinSelectorRef = useRef<HTMLDivElement>(null);
  const mobileCoinRef = useRef<HTMLDivElement>(null);

  const [userBalance, setUserBalance] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHist[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHist[]>([]);
  const [tpslModalPosId, setTpslModalPosId] = useState<number | null>(null);
  const [tpInput, setTpInput] = useState("");
  const [slInput, setSlInput] = useState("");
  const [tpslSaving, setTpslSaving] = useState(false);
  const [tpslError, setTpslError] = useState<string | null>(null);
  const nextId = useRef(1);
  const [tradingLoaded, setTradingLoaded] = useState(false);

  const [currentPrice, setCurrentPrice] = useState("...");
  const [priceNumeric, setPriceNumeric] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState("0.00");
  const [isPositive, setIsPositive] = useState(true);
  const [asks, setAsks] = useState<{price:string;size:string;total:string}[]>([]);
  const [bids, setBids] = useState<{price:string;size:string;total:string}[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string,number>>({});
  const [kyivTime, setKyivTime] = useState("");

  /* ─── Load balance + trading data from DB ─── */
  useEffect(() => {
    if (user?.id == null) return;
    // Load balance
    api.balance(user.id).then(d => setUserBalance(d.balance)).catch(() => {});
    // Load all trading data (positions, orders, histories)
    api.tradingData(user.id).then(data => {
      setPositions(data.positions.map(p => ({ ...p, side: p.side as "long"|"short" })));
      setPendingOrders(data.pendingOrders.map(o => ({ ...o, type: o.type as "limit"|"trigger", side: o.side as "long"|"short", execType: o.execType as "limit"|"market"|undefined, triggerDirection: o.triggerDirection as "up"|"down"|undefined })));
      setOrderHistory(data.orderHistory.map(o => ({ ...o, type: o.type as "limit"|"trigger"|"market", side: o.side as "long"|"short", status: o.status as "filled"|"cancelled" })));
      setTradeHistory(data.tradeHistory.map(t => ({ ...t, side: t.side as "long"|"short" })));
      // Set nextId to be above any loaded IDs
      const allIds = [...data.positions.map(p=>p.id), ...data.pendingOrders.map(o=>o.id), ...data.orderHistory.map(o=>o.id), ...data.tradeHistory.map(t=>t.id)];
      if (allIds.length) nextId.current = Math.max(...allIds) + 1;
      setTradingLoaded(true);
    }).catch(err => { console.error("[trading] load failed", err); setTradingLoaded(true); });
  }, [user?.id]);

  /* ─── Kyiv Clock ─── */
  useEffect(() => {
    const tick = () => setKyivTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Kiev", hour12: false }));
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);

  /* ─── Coin selector outside-click ─── */
  useEffect(() => {
    if (!coinSelectorOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (coinSelectorRef.current?.contains(t) || mobileCoinRef.current?.contains(t)) return;
      setCoinSelectorOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [coinSelectorOpen]);

  /* ─── WebSocket: selected coin ─── */
  useEffect(() => {
    const pl = selectedCoin.pair.toLowerCase();
    setPriceInput(""); setCurrentPrice("..."); setPriceNumeric(0); setAsks([]); setBids([]);
    const t = new WebSocket(`wss://stream.binance.com:9443/ws/${pl}@ticker`);
    t.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.c) {
        const p = parseFloat(d.c);
        setPriceNumeric(p);
        setCurrentPrice(fmt(p));
        setPriceChangePercent(parseFloat(d.P).toFixed(2));
        setIsPositive(parseFloat(d.P) >= 0);
        // Do not force priceInput here so the user sees live price for Market
        setPriceMap(m => ({ ...m, [selectedCoin.pair]: p }));
      }
    };
    const ob = new WebSocket(`wss://stream.binance.com:9443/ws/${pl}@depth20@1000ms`);
    ob.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.bids && d.asks) {
        let ct = 0;
        setBids(d.bids.slice(0,20).map((b: string[]) => { const pr=parseFloat(b[0]),sz=parseFloat(b[1]); ct+=sz; return {price:fmt(pr),size:sz.toFixed(3),total:ct.toFixed(3)}; }));
        ct = 0;
        setAsks(d.asks.slice(0,20).map((a: string[]) => { const pr=parseFloat(a[0]),sz=parseFloat(a[1]); ct+=sz; return {price:fmt(pr),size:sz.toFixed(3),total:ct.toFixed(3)}; }).reverse());
      }
    };
    return () => { t.close(); ob.close(); };
  }, [selectedCoin.pair]);

  /* ─── WebSocket: other coin prices (for positions + pending orders) ─── */
  useEffect(() => {
    const others = [...new Set([...positions.map(p => p.pair), ...pendingOrders.map(o => o.pair)])].filter(p => p !== selectedCoin.pair);
    if (!others.length) return;
    const wss = others.map(pair => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@miniTicker`);
      ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.c) setPriceMap(m => ({ ...m, [pair]: parseFloat(d.c) })); };
      return ws;
    });
    return () => wss.forEach(ws => ws.close());
  }, [positions.length, pendingOrders.length, selectedCoin.pair]);

  /* ─── Check pending orders for execution ─── */
  useEffect(() => {
    if (!pendingOrders.length) return;
    const toFill: number[] = [];
    for (const order of pendingOrders) {
      const price = priceMap[order.pair];
      if (!price) continue;
      
      if (order.type === "limit") {
        const fill = order.triggerDirection === "up" ? price >= order.price : price <= order.price;
        if (fill) { toFill.push(order.id); executeOrder(order, order.price); }
      } else if (order.type === "trigger" && order.triggerPrice) {
        const triggers = order.triggerDirection === "up" ? price >= order.triggerPrice : price <= order.triggerPrice;
        if (triggers) {
          toFill.push(order.id);
          if (order.execType === "market") {
            executeOrder(order, price);
          } else {
            const newOrder: PendingOrder = { ...order, id: nextId.current++, type: "limit", triggerDirection: order.side === "long" ? "down" : "up" };
            setPendingOrders(prev => [newOrder, ...prev]);
            // Persist the new limit order to DB
            if (user?.id != null) {
              api.savePendingOrder(user.id, { type: newOrder.type, side: newOrder.side, symbol: newOrder.symbol, pair: newOrder.pair, price: newOrder.price, triggerPrice: newOrder.triggerPrice, execType: newOrder.execType, triggerDirection: newOrder.triggerDirection, sizeUsdt: newOrder.sizeUsdt, leverage: newOrder.leverage, margin: newOrder.margin, createdAt: newOrder.createdAt }).then(r => {
                setPendingOrders(oo => oo.map(o => o.id === newOrder.id ? { ...o, id: r.id } : o));
              }).catch(e => console.error("[trading] save PO", e));
            }
          }
        }
      }
    }
    if (toFill.length) {
      setPendingOrders(prev => prev.filter(o => !toFill.includes(o.id)));
      // Delete filled orders from DB
      if (user?.id != null) {
        for (const id of toFill) {
          api.deletePendingOrder(user.id, id).catch(e => console.error("[trading] del filled order", e));
        }
      }
    }
  }, [priceMap]);

  /* ─── Computed ─── */
  const totalMarginUsed = positions.reduce((s,p) => s+p.margin, 0) + pendingOrders.reduce((s,o) => s+o.margin, 0);
  const availableBalance = Math.max(0, userBalance - totalMarginUsed);
  const modalPosition = useMemo(
    () => positions.find((p) => p.id === tpslModalPosId) ?? null,
    [positions, tpslModalPosId],
  );
  const modalMarkPrice = modalPosition ? (priceMap[modalPosition.pair] || modalPosition.entryPrice) : 0;
  const modalTpValue = parseFloat(tpInput);
  const modalSlValue = parseFloat(slInput);

  /* ─── Handlers ─── */
  const handleSliderChange = useCallback((p: number) => {
    setPercent(p);
    setSizeInput(p > 0 ? (availableBalance * (p/100) * leverage).toFixed(2) : "");
  }, [availableBalance, leverage]);

  const handleSizeChange = useCallback((val: string) => {
    setSizeInput(val);
    const n = parseFloat(val);
    setPercent(n > 0 && availableBalance > 0 ? Math.min(100, Math.round((n/leverage/availableBalance)*100)) : 0);
  }, [availableBalance, leverage]);

  const openTpSlModal = useCallback((pos: Position) => {
    setTpslModalPosId(pos.id);
    setTpInput(pos.takeProfit != null ? String(pos.takeProfit) : "");
    setSlInput(pos.stopLoss != null ? String(pos.stopLoss) : "");
    setTpslError(null);
  }, []);

  const closeTpSlModal = useCallback(() => {
    setTpslModalPosId(null);
    setTpInput("");
    setSlInput("");
    setTpslSaving(false);
    setTpslError(null);
  }, []);

  const saveTpSl = useCallback(async () => {
    if (!modalPosition || user?.id == null) return;

    const parseBound = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const numeric = Number(trimmed);
      if (!Number.isFinite(numeric) || numeric <= 0) return Number.NaN;
      return numeric;
    };

    const takeProfit = parseBound(tpInput);
    const stopLoss = parseBound(slInput);

    if (Number.isNaN(takeProfit) || Number.isNaN(stopLoss)) {
      setTpslError("TP/SL must be positive numbers.");
      return;
    }

    if (takeProfit == null && stopLoss == null) {
      setTpslError("Set at least one value: TP or SL.");
      return;
    }

    if (modalPosition.side === "long") {
      if (takeProfit != null && takeProfit <= modalPosition.entryPrice) {
        setTpslError("For Long, Take Profit should be above entry price.");
        return;
      }
      if (stopLoss != null && stopLoss >= modalPosition.entryPrice) {
        setTpslError("For Long, Stop Loss should be below entry price.");
        return;
      }
    } else {
      if (takeProfit != null && takeProfit >= modalPosition.entryPrice) {
        setTpslError("For Short, Take Profit should be below entry price.");
        return;
      }
      if (stopLoss != null && stopLoss <= modalPosition.entryPrice) {
        setTpslError("For Short, Stop Loss should be above entry price.");
        return;
      }
    }

    try {
      setTpslSaving(true);
      setTpslError(null);
      const saved = await api.updatePositionTpSl(user.id, modalPosition.id, { takeProfit, stopLoss });
      setPositions((prev) => prev.map((p) => (
        p.id === modalPosition.id
          ? { ...p, takeProfit: saved.takeProfit, stopLoss: saved.stopLoss }
          : p
      )));
      closeTpSlModal();
    } catch (error) {
      const message = error instanceof ApiError && error.raw?.includes("Cannot PATCH")
        ? "TP/SL endpoint is not available on the current API server. Switch the frontend to the local backend or deploy the server changes first."
        : error instanceof Error
          ? error.message
          : "Failed to save TP/SL.";
      setTpslError(message);
      setTpslSaving(false);
    }
  }, [closeTpSlModal, modalPosition, slInput, tpInput, user?.id]);

  const addOrAveragePosition = useCallback((side: "long"|"short", entry: number, size: number, lev: number) => {
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === selectedCoin.symbol && p.side === side);
      if (existing) {
        const newSize = existing.sizeUsdt + size;
        const newEntry = (existing.sizeUsdt * existing.entryPrice + size * entry) / newSize;
        const newMargin = existing.margin + size / lev;
        const effLev = newSize / newMargin;
        const updatedPos = {
          ...existing, entryPrice: newEntry, sizeUsdt: newSize, margin: newMargin, leverage: effLev,
          liqPrice: calcLiqPrice(newEntry, effLev, side),
        };
        // Persist to DB
        if (user?.id != null) {
          api.savePosition(user.id, { side: updatedPos.side, symbol: updatedPos.symbol, pair: updatedPos.pair, entryPrice: updatedPos.entryPrice, sizeUsdt: updatedPos.sizeUsdt, leverage: updatedPos.leverage, margin: updatedPos.margin, liqPrice: updatedPos.liqPrice, takeProfit: updatedPos.takeProfit ?? null, stopLoss: updatedPos.stopLoss ?? null, openTime: updatedPos.openTime }).catch(e => console.error("[trading] save pos", e));
        }
        return prev.map(p => p.id === existing.id ? updatedPos : p);
      }
      const newPos: Position = { id: nextId.current++, side, symbol: selectedCoin.symbol, pair: selectedCoin.pair,
        entryPrice: entry, sizeUsdt: size, leverage: lev, margin: size/lev,
        liqPrice: calcLiqPrice(entry, lev, side), openTime: Date.now() };
      // Persist to DB
      if (user?.id != null) {
        api.savePosition(user.id, { side: newPos.side, symbol: newPos.symbol, pair: newPos.pair, entryPrice: newPos.entryPrice, sizeUsdt: newPos.sizeUsdt, leverage: newPos.leverage, margin: newPos.margin, liqPrice: newPos.liqPrice, takeProfit: newPos.takeProfit ?? null, stopLoss: newPos.stopLoss ?? null, openTime: newPos.openTime }).then(r => {
          // Update the local id to the db id
          setPositions(ps => ps.map(p => p.id === newPos.id ? { ...p, id: r.id } : p));
        }).catch(e => console.error("[trading] save pos", e));
      }
      return [newPos, ...prev];
    });
  }, [selectedCoin, user?.id]);

  const executeOrder = useCallback((order: PendingOrder, fillPrice: number) => {
    const filledAt = Date.now();
    const ohEntry = { type: order.type, side: order.side, symbol: order.symbol,
      price: order.price, sizeUsdt: order.sizeUsdt, leverage: order.leverage, status: "filled" as const,
      createdAt: order.createdAt, filledAt };
    const ohId = nextId.current++;
    setOrderHistory(prev => [{ id: ohId, ...ohEntry }, ...prev]);
    // Persist order history
    if (user?.id != null) {
      api.saveOrderHistory(user.id, ohEntry).then(r => {
        setOrderHistory(h => h.map(o => o.id === ohId ? { ...o, id: r.id } : o));
      }).catch(e => console.error("[trading] save OH", e));
    }
    // Add/average position
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === order.symbol && p.side === order.side);
      if (existing) {
        const newSize = existing.sizeUsdt + order.sizeUsdt;
        const newEntry = (existing.sizeUsdt * existing.entryPrice + order.sizeUsdt * fillPrice) / newSize;
        const newMargin = existing.margin + order.margin;
        const effLev = newSize / newMargin;
        const updated = { ...existing, entryPrice: newEntry, sizeUsdt: newSize, margin: newMargin, leverage: effLev, liqPrice: calcLiqPrice(newEntry, effLev, order.side) };
        if (user?.id != null) {
          api.savePosition(user.id, { side: updated.side, symbol: updated.symbol, pair: updated.pair, entryPrice: updated.entryPrice, sizeUsdt: updated.sizeUsdt, leverage: updated.leverage, margin: updated.margin, liqPrice: updated.liqPrice, takeProfit: updated.takeProfit ?? null, stopLoss: updated.stopLoss ?? null, openTime: updated.openTime }).catch(e => console.error("[trading] save pos", e));
        }
        return prev.map(p => p.id === existing.id ? updated : p);
      }
      const newPos: Position = { id: nextId.current++, side: order.side, symbol: order.symbol, pair: order.pair,
        entryPrice: fillPrice, sizeUsdt: order.sizeUsdt, leverage: order.leverage, margin: order.margin,
        liqPrice: calcLiqPrice(fillPrice, order.leverage, order.side), openTime: Date.now() };
      if (user?.id != null) {
        api.savePosition(user.id, { side: newPos.side, symbol: newPos.symbol, pair: newPos.pair, entryPrice: newPos.entryPrice, sizeUsdt: newPos.sizeUsdt, leverage: newPos.leverage, margin: newPos.margin, liqPrice: newPos.liqPrice, takeProfit: newPos.takeProfit ?? null, stopLoss: newPos.stopLoss ?? null, openTime: newPos.openTime }).then(r => {
          setPositions(ps => ps.map(p => p.id === newPos.id ? { ...p, id: r.id } : p));
        }).catch(e => console.error("[trading] save pos", e));
      }
      return [newPos, ...prev];
    });
  }, [user?.id]);

  const openTrade = useCallback((side: "long"|"short") => {
    const sizeStr = sizeInput.replace(/,/g, '.').replace(/\s/g, '');
    const size = parseFloat(sizeStr);
    if (!size || size <= 0) {
      alert("Please enter a valid Size.");
      return;
    }
    if (priceNumeric <= 0) return;
    const margin = size / leverage;
    if (margin > availableBalance + 0.01) {
      alert(`Insufficient balance! Need ${margin.toFixed(2)} USDT but only have ${availableBalance.toFixed(2)} USDT.`);
      return;
    }
    const now = Date.now();
    if (orderType === "Market") {
      addOrAveragePosition(side, priceNumeric, size, leverage);
      const ohEntry = { type: "market" as const, side, symbol: selectedCoin.symbol,
        price: priceNumeric, sizeUsdt: size, leverage, status: "filled" as const, createdAt: now, filledAt: now };
      const ohId = nextId.current++;
      setOrderHistory(prev => [{ id: ohId, ...ohEntry }, ...prev]);
      // Persist order history
      if (user?.id != null) {
        api.saveOrderHistory(user.id, ohEntry).then(r => {
          setOrderHistory(h => h.map(o => o.id === ohId ? { ...o, id: r.id } : o));
        }).catch(e => console.error("[trading] save OH", e));
      }
    } else {
      let targetPrice = parseFloat(priceInput.replace(/,/g, '.').replace(/\s/g, ''));
      let trigPrice: number | undefined = undefined;
      let trigDir: "up" | "down" = "down";

      if (orderType === "Limit") {
        if (!targetPrice || targetPrice <= 0) {
          alert("Please enter a valid target price for this limit order.");
          return;
        }
        trigDir = targetPrice > priceNumeric ? "up" : "down";
      }
      
      if (orderType === "Trigger") {
        trigPrice = parseFloat(triggerPriceInput.replace(/,/g, '.').replace(/\s/g, ''));
        if (!trigPrice || trigPrice <= 0) {
          alert("Please enter a valid trigger price.");
          return;
        }
        trigDir = trigPrice > priceNumeric ? "up" : "down";

        if (triggerExecType === "Limit") {
          if (!targetPrice || targetPrice <= 0) {
            alert("Please enter a valid limit price.");
            return;
          }
        }
        if (triggerExecType === "Market") {
           targetPrice = priceNumeric; // placeholder
        }
      }

      const pendingOrderData = { type: (orderType === "Limit" ? "limit" : "trigger") as "limit"|"trigger",
        side, symbol: selectedCoin.symbol, pair: selectedCoin.pair,
        price: targetPrice, triggerPrice: trigPrice, execType: orderType === "Trigger" ? (triggerExecType === "Limit" ? "limit" : "market") as "limit"|"market" : undefined,
        triggerDirection: trigDir, sizeUsdt: size, leverage, margin, createdAt: now };
      const poId = nextId.current++;
      setPendingOrders(prev => [{ id: poId, ...pendingOrderData }, ...prev]);
      // Persist pending order
      if (user?.id != null) {
        api.savePendingOrder(user.id, pendingOrderData).then(r => {
          setPendingOrders(oo => oo.map(o => o.id === poId ? { ...o, id: r.id } : o));
        }).catch(e => console.error("[trading] save PO", e));
      }
      // Also record in order history
      const ohEntry2 = { type: pendingOrderData.type, side,
        symbol: selectedCoin.symbol, price: targetPrice, sizeUsdt: size, leverage, status: "filled" as const,
        createdAt: now };
      const ohId2 = nextId.current++;
      setOrderHistory(prev => [{ id: ohId2, ...ohEntry2 }, ...prev]);
      if (user?.id != null) {
        api.saveOrderHistory(user.id, ohEntry2).then(r => {
          setOrderHistory(h => h.map(o => o.id === ohId2 ? { ...o, id: r.id } : o));
        }).catch(e => console.error("[trading] save OH", e));
      }
    }
    setSizeInput(""); setPercent(0);
  }, [sizeInput, priceNumeric, leverage, availableBalance, orderType, priceInput, selectedCoin, addOrAveragePosition, user?.id]);

  const closePosition = useCallback((posId: number) => {
    setPositions(prev => {
      const pos = prev.find(p => p.id === posId);
      if (pos) {
        const mark = priceMap[pos.pair] || pos.entryPrice;
        const pnl = calcPnl(pos, mark);
        const closedAt = Date.now();
        const thEntry = { side: pos.side, symbol: pos.symbol,
          entryPrice: pos.entryPrice, exitPrice: mark, sizeUsdt: pos.sizeUsdt, leverage: pos.leverage,
          pnl, openedAt: pos.openTime, closedAt };
        const thId = nextId.current++;
        setTradeHistory(h => [{ id: thId, ...thEntry }, ...h]);
        setUserBalance(b => b + pnl);
        // Persist to DB
        if (user?.id != null) {
          api.deletePosition(user.id, posId).catch(e => console.error("[trading] del pos", e));
          api.saveTradeHistory(user.id, thEntry).then(r => {
            setTradeHistory(th => th.map(t => t.id === thId ? { ...t, id: r.id } : t));
          }).catch(e => console.error("[trading] save TH", e));
          api.updateTradingBalance(user.id, pnl).then(r => {
            setUserBalance(r.balance);
          }).catch(e => console.error("[trading] update balance", e));
        }
      }
      return prev.filter(p => p.id !== posId);
    });
  }, [priceMap, user?.id]);

  const cancelOrder = useCallback((orderId: number) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    // Persist to DB
    if (user?.id != null) {
      api.deletePendingOrder(user.id, orderId).catch(e => console.error("[trading] del order", e));
    }
  }, [user?.id]);

  // Auto-close positions when TP/SL is reached.
  useEffect(() => {
    if (!positions.length) return;

    const triggered: number[] = [];
    for (const pos of positions) {
      const mark = priceMap[pos.pair];
      if (!mark) continue;

      const tpHit = pos.takeProfit != null
        && ((pos.side === "long" && mark >= pos.takeProfit) || (pos.side === "short" && mark <= pos.takeProfit));
      const slHit = pos.stopLoss != null
        && ((pos.side === "long" && mark <= pos.stopLoss) || (pos.side === "short" && mark >= pos.stopLoss));

      if (tpHit || slHit) {
        triggered.push(pos.id);
      }
    }

    if (!triggered.length) return;
    for (const id of [...new Set(triggered)]) {
      closePosition(id);
    }
  }, [closePosition, positions, priceMap]);

  const filteredCoins = useMemo(() => {
    const q = coinSearch.toLowerCase();
    return q ? COINS.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) : COINS;
  }, [coinSearch]);



  /* ═══════════════════════ Slider CSS (shared) ═══════════════════════ */
  const sliderStyles = `
    .trade-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
    .trade-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #00FFA3; cursor: pointer; border: 2px solid #05070A; box-shadow: 0 0 6px rgba(0,255,163,0.5); margin-top: -1px; }
    .trade-slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #00FFA3; cursor: pointer; border: 2px solid #05070A; box-shadow: 0 0 6px rgba(0,255,163,0.5); }
  `;

  /* ═══════════════════════ Bottom tabs config ═══════════════════════ */
  const bottomTabs = [
    { id: "positions", label: `POSITIONS (${positions.length})` },
    { id: "open-orders", label: `OPEN ORDERS (${pendingOrders.length})` },
    { id: "order-history", label: "ORDER HISTORY" },
    { id: "trade-history", label: "TRADE HISTORY" },
    { id: "assets", label: "ASSETS" },
  ];

  /* ═══════════════════════ Render ═══════════════════════ */
  return (<>
    {/* Global slider styles */}
    <style>{sliderStyles}</style>

    {/* ═══ MOBILE LAYOUT (< xl) ═══ */}
    <div className="xl:hidden flex flex-col min-h-screen bg-[#05070A] text-white font-inter relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img src="/images/bg-lines.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
      </div>

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 flex h-12 min-[375px]:h-14 md:h-16 items-center justify-between bg-[#05070A]/95 px-3 min-[375px]:px-4 md:px-6 backdrop-blur-md border-b border-white/5 shrink-0">
        <Link to="/" className="flex items-center shrink-0">
          <img src="public/images/logo.png" alt="UPDOWNX" className="h-5 min-[375px]:h-6 md:h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2 min-[375px]:gap-3 md:gap-4">
          <button className="flex items-center gap-1 text-[10px] min-[375px]:text-[11px] md:text-sm text-gray-400 bg-transparent border-none cursor-pointer">
            EN <ChevronDown className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
          </button>
          <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1 min-[375px]:px-3 min-[375px]:py-1.5 md:px-5 md:py-2 text-[9px] min-[375px]:text-[10px] md:text-sm font-bold text-black no-underline">
            START
          </Link>
          <button onClick={() => setSidebarOpen(p => !p)} className="text-gray-300 hover:text-white bg-transparent border-none cursor-pointer p-0" aria-label="Toggle menu">
            {sidebarOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </header>

      {/* ─── Sub-nav tabs (toggled by hamburger) ─── */}
      {sidebarOpen && (
        <nav className="relative z-30 flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full">
          <div className="flex w-full justify-evenly rounded-[13px] border border-[#12313a] bg-[#081018]/80 p-1 min-[375px]:rounded-[16px] min-[375px]:p-1.5 min-[400px]:rounded-[18px] md:gap-2 md:rounded-[22px] md:px-3 md:py-2 lg:gap-4 lg:rounded-[28px] lg:px-5 lg:py-3">
            {["Trade", "Markets", "Positions", "Traders"].map(item => (
              <button
                key={item}
                className={`flex-1 relative flex items-center justify-center text-center rounded-lg px-0.5 py-1.5 text-[8px] leading-tight font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-1 min-[375px]:py-2 min-[375px]:text-[10px] min-[400px]:px-2 min-[400px]:text-[11px] md:rounded-2xl md:px-6 md:py-3 md:text-sm lg:px-10 lg:py-5 lg:text-lg ${
                  item === "Trade" ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                }`}
                style={{background:"transparent"}}
              >
                {item}
                <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 md:bottom-2 md:left-3 md:right-3 md:h-0.5 lg:bottom-3 lg:left-5 lg:right-5 ${item === "Trade" ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ─── Main Scrollable Content ─── */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-20 px-2 min-[375px]:px-3 md:px-4 flex flex-col gap-2 min-[375px]:gap-3 md:gap-4 pt-2 min-[375px]:pt-3 md:pt-4">

        {/* Pair Header + Timeframes */}
        <div className="flex items-center justify-between px-3 min-[375px]:px-4 md:px-6 py-2 min-[375px]:py-2.5 md:py-4 border border-[#1a2a32] rounded-[16px] bg-[#0A0F14]/90 backdrop-blur-md relative" ref={mobileCoinRef}>
          <div className="flex items-center gap-1.5 min-[375px]:gap-2 cursor-pointer select-none" onClick={() => setCoinSelectorOpen(o => !o)}>
            <CoinIcon symbol={selectedCoin.symbol} color={selectedCoin.color} size={18} />
            <span className="font-bold text-[12px] min-[375px]:text-[13px] md:text-[15px] text-white">{selectedCoin.symbol}/USDT</span>
            <span className={`px-1 py-0.5 rounded text-[8px] min-[375px]:text-[9px] md:text-[10px] font-bold ${isPositive ? "text-[#00ffa3] bg-[#00ffa3]/10" : "text-[#ff4d4d] bg-[#ff4d4d]/10"}`}>{isPositive ? "+" : ""}{priceChangePercent}%</span>
          </div>
          <div className="flex items-center gap-0.5 min-[375px]:gap-1">
            {["5m","1h","4h","1D"].map((tf,i) => (
              <button key={tf} className={`px-1 min-[375px]:px-1.5 md:px-2.5 py-0.5 min-[375px]:py-1 text-[8px] min-[375px]:text-[9px] md:text-[11px] font-semibold rounded border-none cursor-pointer transition-colors ${i===0?"bg-[#00ffa3]/15 text-[#00ffa3]":"text-gray-500 hover:text-white bg-transparent"}`}>{tf}</button>
            ))}
            <button className="px-1 min-[375px]:px-1.5 md:px-2.5 py-0.5 min-[375px]:py-1 text-[8px] min-[375px]:text-[9px] md:text-[11px] font-semibold rounded text-gray-500 bg-transparent border-none cursor-pointer">More</button>
          </div>
          {/* Coin Selector Dropdown */}
          {coinSelectorOpen && (
            <div className="absolute top-full left-3 right-3 min-[375px]:left-4 min-[375px]:right-4 md:left-6 md:right-6 bg-[#0b0f14] border border-white/10 rounded-xl shadow-2xl z-[200] flex flex-col" style={{maxHeight:320}}>
              <div className="p-2 min-[375px]:p-3 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 bg-[#111820] rounded-lg px-2 min-[375px]:px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <input type="text" placeholder="Search..." value={coinSearch} onChange={e => setCoinSearch(e.target.value)} autoFocus className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-600 w-full" />
                  {coinSearch && <button onClick={() => setCoinSearch("")} className="text-gray-500 hover:text-white bg-transparent border-none cursor-pointer p-0"><X className="w-3 h-3" /></button>}
                </div>
              </div>
              <div className={`overflow-y-auto flex-1 ${scrollbarCls}`} style={{maxHeight:260}}>
                {filteredCoins.map(coin => (
                  <div key={coin.symbol} className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-white/5 ${coin.symbol===selectedCoin.symbol?"bg-[#00ffa3]/10":""}`}
                    onMouseDown={(e) => {e.preventDefault();e.stopPropagation();setSelectedCoin(coin);setCoinSelectorOpen(false);setCoinSearch("");}}>
                    <CoinIcon symbol={coin.symbol} color={coin.color} size={20} />
                    <span className="text-xs font-semibold text-white">{coin.symbol}</span>
                    <span className="text-[10px] text-gray-500">{coin.name}</span>
                  </div>
                ))}
                {!filteredCoins.length && <div className="px-4 py-4 text-center text-gray-500 text-xs">No coins found</div>}
              </div>
            </div>
          )}
        </div>

        {/* ─── TradingView Chart ─── */}
        <div className="h-[180px] min-[375px]:h-[220px] md:h-[300px] lg:h-[360px] bg-[#0A0F14]/90 backdrop-blur-md border border-[#1a2a32] rounded-[16px] overflow-hidden relative" key={`m-chart-${selectedCoin.pair}`}>
          <AdvancedRealTimeChart theme="dark" symbol={`BINANCE:${selectedCoin.pair}`} interval="5" hide_legend allow_symbol_change={false} save_image={false} backgroundColor="#05070A" autosize />
        </div>

        {/* ─── Order Book + Trade Panel (side by side) ─── */}
        <div className="flex gap-2 min-[375px]:gap-3 md:gap-4">

          {/* Order Book */}
          <div className="w-1/2 border border-[#1a2a32] rounded-[16px] bg-[#0A0F14]/90 backdrop-blur-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-2 min-[375px]:px-2.5 md:px-4 py-1.5 min-[375px]:py-2 border-b border-[#1a2a32] shrink-0">
              <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] font-bold text-[#A6B2C8] tracking-wider uppercase">Order Book</span>
              <div className="flex bg-[#111820] rounded p-0.5 gap-0.5">
                {(["both","bids","asks"] as const).map(v => (
                  <button key={v} onClick={() => setOrderBookView(v)} className={`w-4 min-[375px]:w-5 md:w-6 h-3 min-[375px]:h-3.5 md:h-5 rounded flex items-center justify-center border-none cursor-pointer p-0 ${orderBookView===v?"bg-[#2A3441]":"bg-transparent"}`}>
                    <div className={`w-2 min-[375px]:w-2.5 md:w-3 h-1.5 min-[375px]:h-2 md:h-2.5 rounded-[1px] ${v==="both"?"bg-gradient-to-b from-[#ff4d4d] to-[#00ffa3]":v==="bids"?"bg-[#00ffa3]":"bg-[#ff4d4d]"}`} />
                  </button>
                ))}
              </div>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-3 px-2 min-[375px]:px-2.5 md:px-4 py-0.5 min-[375px]:py-1 shrink-0">
              {["PRICE","SIZE","SUM"].map(h => <span key={h} className={`text-[5px] min-[375px]:text-[6px] md:text-[8px] text-[#A6B2C8] font-semibold tracking-wide uppercase ${h!=="PRICE"?"text-right":""}`}>{h}</span>)}
            </div>
            {/* Asks */}
            {orderBookView !== "bids" && (
              <div className="flex flex-col px-2 min-[375px]:px-2.5 md:px-4 justify-end border-b border-[#05070A]/50">
                {(orderBookView==="asks"?asks.slice(-10):asks.slice(-8)).map((r,i) => (
                  <div key={`ma${i}`} onClick={() => {setPriceInput(r.price.replace(/,/g,""));setOrderType("Limit");}} className="grid grid-cols-3 py-[1px] cursor-pointer hover:bg-white/5">
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#ff4d4d] font-semibold truncate">{r.price}</span>
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-300 text-right font-mono truncate">{r.size}</span>
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 text-right font-mono truncate">{r.total}</span>
                  </div>
                ))}
                {!asks.length && <div className="text-[7px] text-gray-600 py-2 text-center">Loading...</div>}
              </div>
            )}
            {/* Spread */}
            <div className="px-2 min-[375px]:px-2.5 md:px-4 py-1 min-[375px]:py-1.5 border-y border-white/5 flex items-center gap-1.5 shrink-0">
              <span className={`text-[9px] min-[375px]:text-[10px] md:text-[13px] font-bold ${isPositive?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{currentPrice}</span>
              <span className="text-[6px] min-[375px]:text-[7px] md:text-[9px] text-gray-500 font-medium">Spread {bids.length && asks.length ? (parseFloat(asks[asks.length-1]?.price.replace(/,/g,'') || '0') - parseFloat(bids[0]?.price.replace(/,/g,'') || '0')).toFixed(2) : '—'}</span>
            </div>
            {/* Bids */}
            {orderBookView !== "asks" && (
              <div className="flex flex-col px-2 min-[375px]:px-2.5 md:px-4">
                {(orderBookView==="bids"?bids.slice(0,10):bids.slice(0,8)).map((r,i) => (
                  <div key={`mb${i}`} onClick={() => {setPriceInput(r.price.replace(/,/g,""));setOrderType("Limit");}} className="grid grid-cols-3 py-[1px] cursor-pointer hover:bg-white/5">
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#00ffa3] font-semibold truncate">{r.price}</span>
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-300 text-right font-mono truncate">{r.size}</span>
                    <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 text-right font-mono truncate">{r.total}</span>
                  </div>
                ))}
                {!bids.length && <div className="text-[7px] text-gray-600 py-2 text-center">Loading...</div>}
              </div>
            )}
          </div>

          {/* Trade Panel */}
          <div className="w-1/2 flex flex-col p-2 min-[375px]:p-2.5 md:p-4 border border-[#1a2a32] rounded-[16px] bg-[#0A0F14]/90 backdrop-blur-md relative overflow-hidden">
            <span className="text-[8px] min-[375px]:text-[9px] md:text-sm font-bold text-[#A6B2C8] tracking-wider uppercase mb-1.5 min-[375px]:mb-2 md:mb-3">Trade</span>
            {/* Limit / Market / Trigger */}
            <div className="flex gap-0.5 bg-[#111820] rounded-lg p-0.5 mb-1.5 min-[375px]:mb-2 md:mb-3">
              {(["Limit","Market","Trigger"] as const).map(t => (
                <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-1 min-[375px]:py-1.5 text-[7px] min-[375px]:text-[8px] md:text-[11px] font-bold rounded-md border-none cursor-pointer transition-colors ${orderType===t?"bg-[#00FFA3] text-[#05070A]":"bg-transparent text-gray-500 hover:text-white"}`}>{t}</button>
              ))}
            </div>
            {/* Margin + Leverage dropdowns */}
            <div className="flex gap-1 mb-1.5 min-[375px]:mb-2 md:mb-3 relative">
              <div className="flex-1 relative">
                <div onClick={() => {setMarginDropdownOpen(!marginDropdownOpen);setLeverageDropdownOpen(false);}} className="bg-[#111820] rounded-lg px-1.5 min-[375px]:px-2 md:px-3 py-1 min-[375px]:py-1.5 flex items-center justify-between cursor-pointer border border-[#111820]">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[11px] text-white font-bold">{marginType}</span>
                  <ChevronDown className="w-2 h-2 min-[375px]:w-2.5 min-[375px]:h-2.5 text-gray-400" />
                </div>
                {marginDropdownOpen && <div className="absolute top-[calc(100%+2px)] left-0 w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-0.5">
                  {(["CROSS","ISOLATED"] as const).map(t => <div key={t} onClick={() => {setMarginType(t);setMarginDropdownOpen(false);}} className={`px-2 py-1 text-[7px] min-[375px]:text-[8px] md:text-[11px] font-bold cursor-pointer ${marginType===t?"text-[#00ffa3] bg-white/5":"text-white hover:bg-white/5"}`}>{t}</div>)}
                </div>}
              </div>
              <div className="flex-1 relative">
                <div onClick={() => {setLeverageDropdownOpen(!leverageDropdownOpen);setMarginDropdownOpen(false);}} className="bg-[#111820] rounded-lg px-1.5 min-[375px]:px-2 md:px-3 py-1 min-[375px]:py-1.5 flex items-center justify-between cursor-pointer border border-[#111820]">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[11px] text-white font-bold">{leverage}X</span>
                  <ChevronDown className="w-2 h-2 min-[375px]:w-2.5 min-[375px]:h-2.5 text-gray-400" />
                </div>
                {leverageDropdownOpen && <div className="absolute right-0 top-[calc(100%+2px)] w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-0.5">
                  {[1,2,3,4,5].map(v => <div key={v} onClick={() => {setLeverage(v);setLeverageDropdownOpen(false);}} className={`px-2 py-1 text-[7px] min-[375px]:text-[8px] md:text-[11px] font-bold cursor-pointer ${leverage===v?"text-[#00ffa3] bg-white/5":"text-white hover:bg-white/5"}`}>{v}X</div>)}
                </div>}
              </div>
            </div>
            {/* Trigger Price */}
            {orderType === "Trigger" && (
              <div className="mb-1">
                <div className="flex justify-between mb-0.5"><span className="text-[7px] min-[375px]:text-[8px] text-gray-500 font-bold">Trigger</span><span className="text-[6px] min-[375px]:text-[7px] text-gray-500">USDT</span></div>
                <div className="bg-[#111820] rounded-lg px-1.5 min-[375px]:px-2 py-1 border border-transparent focus-within:border-[#00ffa3]/30">
                  <input type="number" value={triggerPriceInput} onChange={e => setTriggerPriceInput(e.target.value)} placeholder="0.00" className="w-full bg-transparent border-none outline-none text-[9px] min-[375px]:text-[10px] md:text-[12px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>
            )}
            {/* Price */}
            {!(orderType === "Trigger" && triggerExecType === "Market") && (
              <div className="mb-1">
                <div className="flex justify-between mb-0.5"><span className="text-[7px] min-[375px]:text-[8px] text-gray-500 font-bold">Price</span><span className="text-[6px] min-[375px]:text-[7px] text-gray-500">USDT</span></div>
                <div className="bg-[#111820] rounded-lg px-1.5 min-[375px]:px-2 py-1 border border-transparent focus-within:border-[#00ffa3]/30">
                  <input type="number" value={orderType==="Market"?(priceNumeric>0?priceNumeric.toFixed(2):""):priceInput} onChange={e => setPriceInput(e.target.value)} placeholder={orderType==="Market"?"Market":"0.00"} disabled={orderType==="Market"} className="w-full bg-transparent border-none outline-none text-[9px] min-[375px]:text-[10px] md:text-[12px] font-medium text-white placeholder-gray-700 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>
            )}
            {/* Size */}
            <div className="mb-1">
              <div className="flex justify-between mb-0.5"><span className="text-[7px] min-[375px]:text-[8px] text-gray-500 font-bold">Size</span><span className="text-[6px] min-[375px]:text-[7px] text-gray-500">BTC</span></div>
              <div className="bg-[#111820] rounded-lg px-1.5 min-[375px]:px-2 py-1 border border-transparent focus-within:border-[#00ffa3]/30">
                <input type="number" value={sizeInput} onChange={e => handleSizeChange(e.target.value)} placeholder="0.00" className="w-full bg-transparent border-none outline-none text-[9px] min-[375px]:text-[10px] md:text-[12px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>

            {/* Slider */}
            <div className="mb-1 px-0.5">
              <input type="range" min="0" max="100" value={percent} onChange={e => handleSliderChange(Number(e.target.value))} className="trade-slider w-full" style={{background:`linear-gradient(to right,#00FFA3 ${percent}%,#111820 ${percent}%)`}} />
              <div className="flex justify-between mt-0.5">
                {[0,25,50,75,100].map(p => <button key={p} onClick={() => handleSliderChange(p)} className={`text-[6px] min-[375px]:text-[7px] md:text-[8px] font-bold bg-transparent border-none cursor-pointer ${percent===p?"text-[#00FFA3]":"text-gray-500"}`}>{p}%</button>)}
              </div>
            </div>
            {/* Available Balance */}
            <div className="flex justify-between items-center py-0.5 mb-1.5 min-[375px]:mb-2">
              <span className="text-[7px] min-[375px]:text-[8px] text-gray-500">Available Balance</span>
              <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] font-bold text-white">{fmt(availableBalance)} USDT</span>
            </div>
            {/* Buy / Sell Buttons */}
            <div className="flex flex-col gap-1 min-[375px]:gap-1.5">
              <button onClick={() => openTrade("long")} className="w-full h-7 min-[375px]:h-8 md:h-10 rounded-lg bg-gradient-to-b from-[#00FFA3] to-[#009962] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_8px_rgba(0,255,163,0.2)]">
                <span className="font-bold text-[#05070a] text-[9px] min-[375px]:text-[10px] md:text-[12px] tracking-wide leading-none">{orderType==="Market"?"BUY / LONG":`${orderType.toUpperCase()} BUY`}</span>
                <span className="text-[5px] min-[375px]:text-[6px] text-[#05070a]/70 font-bold tracking-wider leading-none mt-0.5">PRICE: {orderType==="Market"?currentPrice:priceInput||"—"}</span>
              </button>
              <button onClick={() => openTrade("short")} className="w-full h-7 min-[375px]:h-8 md:h-10 rounded-lg bg-gradient-to-b from-[#FF3B3B] to-[#992323] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_8px_rgba(255,59,59,0.2)]">
                <span className="font-bold text-white text-[9px] min-[375px]:text-[10px] md:text-[12px] tracking-wide leading-none">{orderType==="Market"?"SELL / SHORT":`${orderType.toUpperCase()} SELL`}</span>
                <span className="text-[5px] min-[375px]:text-[6px] text-white/70 font-bold tracking-wider leading-none mt-0.5">PRICE: {orderType==="Market"?currentPrice:priceInput||"—"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Positions / Orders Section ─── */}
        <div className="border border-[#1a2a32] rounded-[16px] bg-[#0A0F14]/90 backdrop-blur-md overflow-hidden">
          {/* Tabs */}
          <div className={`flex items-center gap-2 min-[375px]:gap-3 md:gap-5 px-3 min-[375px]:px-4 md:px-6 pt-2 border-b border-white/5 overflow-x-auto shrink-0 ${scrollbarCls}`}>
            {bottomTabs.map(tab => {
              const on = bottomTab===tab.id;
              return <button key={tab.id} onClick={() => setBottomTab(tab.id)} className={`pb-2 text-[6px] min-[375px]:text-[7px] md:text-[9px] font-bold tracking-wider border-none cursor-pointer relative whitespace-nowrap ${on?"text-[#00ffa3]":"text-[#A6B2C8] hover:text-white"}`} style={{background:"transparent"}}>
                {tab.label}{on && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ffa3] shadow-[0_0_6px_rgba(0,255,163,1)] rounded-t-full" />}
              </button>;
            })}
          </div>
          {/* Tab Content */}
          <div className="overflow-x-auto">
            {bottomTab === "positions" && (<>
              <div className="grid grid-cols-7 gap-1 px-3 min-[375px]:px-4 md:px-6 py-1.5 border-b border-white/5 min-w-[560px]">
                {["SIZE","ENTRY PRICE","MARK PRICE","LIQ.PRICE","MARGIN/RATIO","PNL (ROE%)",""].map(c => <span key={c} className="text-[6px] min-[375px]:text-[7px] md:text-[9px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{c}</span>)}
              </div>
              {positions.length ? positions.map(pos => {
                const mark = priceMap[pos.pair]||pos.entryPrice;
                const pnl = calcPnl(pos, mark);
                const roe = (pnl/pos.margin)*100;
                const up = pnl>=0;
                return <div key={pos.id} className="grid grid-cols-7 gap-1 py-1.5 px-3 min-[375px]:px-4 md:px-6 border-b border-white/5 items-center min-w-[560px]">
                  <span className={`text-[7px] min-[375px]:text-[8px] md:text-[10px] font-bold ${pos.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>${fmt(pos.sizeUsdt)}</span>
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-white font-mono">{fmt(pos.entryPrice)}</span>
                  <span className={`text-[7px] min-[375px]:text-[8px] md:text-[10px] font-mono ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{fmt(mark)}</span>
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#ff9500] font-mono">{fmt(pos.liqPrice)}</span>
                  <span className={`text-[7px] min-[375px]:text-[8px] md:text-[10px] text-white font-mono`}>${fmt(pos.margin)}</span>
                  <span className={`text-[7px] min-[375px]:text-[8px] md:text-[10px] font-bold ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{up?"+":""}{pnl.toFixed(2)} ({up?"+":""}{roe.toFixed(2)}%)</span>
                  <div className="flex flex-col items-start gap-1">
                    <button
                      onClick={() => openTpSlModal(pos)}
                      className="inline-flex items-center gap-0.5 text-[6px] min-[375px]:text-[7px] font-bold text-[#00ffa3] bg-[#09231c] px-1.5 py-0.5 rounded border border-[#00ffa3]/30 cursor-pointer w-fit"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Add
                    </button>
                    <button onClick={() => closePosition(pos.id)} className="text-[6px] min-[375px]:text-[7px] font-bold text-gray-400 bg-[#1a2030] px-1.5 py-0.5 rounded border-none cursor-pointer w-fit">Close</button>
                    {(pos.takeProfit != null || pos.stopLoss != null) && (
                      <span className="text-[6px] min-[375px]:text-[7px] text-gray-400 leading-tight">
                        TP: {pos.takeProfit != null ? fmt(pos.takeProfit) : "—"} / SL: {pos.stopLoss != null ? fmt(pos.stopLoss) : "—"}
                      </span>
                    )}
                  </div>
                </div>;
              }) : <div className="flex flex-col items-center justify-center gap-2 py-6">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                <span className="text-gray-500 text-[8px] min-[375px]:text-[9px] md:text-[10px]">No Open Positions</span>
              </div>}
            </>)}

            {bottomTab === "open-orders" && (
              pendingOrders.length ? <div className="px-3 min-[375px]:px-4 md:px-6 py-2">
                {pendingOrders.map(o => <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] min-[375px]:text-[9px] font-bold ${o.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{o.symbol} {o.side==="long"?"Buy":"Sell"}</span>
                    <span className="text-[8px] text-gray-400">{fmt(o.price)}</span>
                  </div>
                  <button onClick={() => cancelOrder(o.id)} className="text-[7px] font-bold text-[#ff4d4d] bg-[#2a1520] px-1.5 py-0.5 rounded border-none cursor-pointer">Cancel</button>
                </div>)}
              </div> : <div className="flex items-center justify-center py-6 text-gray-500 text-[8px] min-[375px]:text-[9px]">No Open Orders</div>
            )}

            {bottomTab === "order-history" && (
              orderHistory.length ? <div className="px-3 min-[375px]:px-4 md:px-6 py-2">
                {orderHistory.map(o => <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className={`text-[8px] min-[375px]:text-[9px] font-bold ${o.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{o.symbol} {o.type}</span>
                  <span className="text-[8px] text-gray-400">{fmtDate(o.createdAt)}</span>
                </div>)}
              </div> : <div className="flex items-center justify-center py-6 text-gray-500 text-[8px] min-[375px]:text-[9px]">No Order History</div>
            )}

            {bottomTab === "trade-history" && (
              tradeHistory.length ? <div className="px-3 min-[375px]:px-4 md:px-6 py-2">
                {tradeHistory.map(t => {
                  const up=t.pnl>=0;
                  return <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className={`text-[8px] min-[375px]:text-[9px] font-bold ${t.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{t.symbol} {t.side==="long"?"Long":"Short"}</span>
                    <span className={`text-[8px] font-bold ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{up?"+":""}{t.pnl.toFixed(2)}</span>
                  </div>;
                })}
              </div> : <div className="flex items-center justify-center py-6 text-gray-500 text-[8px] min-[375px]:text-[9px]">No Trade History</div>
            )}

            {bottomTab === "assets" && <div className="flex items-center justify-center py-6 text-gray-500 text-[8px] min-[375px]:text-[9px]">Assets view coming soon</div>}
          </div>
        </div>

        {/* ─── Footer Info ─── */}
        <div className="flex flex-wrap items-center justify-between px-3 min-[375px]:px-4 md:px-6 py-2 min-[375px]:py-2.5">
          <div className="flex items-center gap-2 min-[375px]:gap-3">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_5px_#00ffa3]" /><span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#afc0c9]">Connection: Secure</span></div>
            <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#89a4ad]">Server Time: {kyivTime} (UTC)</span>
          </div>
          <span className="text-[6px] min-[375px]:text-[7px] md:text-[9px] text-[#A6B2C8] font-bold tracking-widest">UPDOWN PROTOCOL V2.4.1</span>
        </div>
      </div>

      {/* ─── Fixed Bottom Navigation ─── */}
      {/* <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#05070A]/95 backdrop-blur-md border-t border-white/5 py-1.5 min-[375px]:py-2 md:py-3 xl:hidden">
        {[
          {label:"Trading",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg>,active:true},
          {label:"Balance",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>},
          {label:"Tournaments",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>},
          {label:"History",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>},
          {label:"Account",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
        ].map(item => (
          <button key={item.label} className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer transition-colors ${item.active?"text-[#00ffa3]":"text-gray-500 hover:text-gray-300"}`}>
            <div className="w-4 h-4 min-[375px]:w-[18px] min-[375px]:h-[18px] md:w-5 md:h-5 flex items-center justify-center">{item.icon}</div>
            <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav> */}
    </div>

    {/* ═══ DESKTOP LAYOUT (≥ xl) ═══ */}
    <div className="hidden xl:flex flex-col h-screen bg-[#05070A] text-white font-inter overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070a]">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen" />
      </div>
      <div className="flex flex-col h-full relative z-10 overflow-hidden">

        {/* ─── Header ─── */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md shrink-0 z-50">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center shrink-0"><img src="public/images/logo.png" alt="UPDOWNX" className="h-7 w-auto" /></Link>

          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] text-gray-500 font-semibold tracking-wider uppercase">Balance</span>
              <span className="text-sm font-bold text-white">{fmt(userBalance)} <span className="text-gray-400 text-xs">USDT</span></span>
            </div>
            <button className="bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-bold text-[11px] px-5 py-2.5 rounded-full border-none cursor-pointer transition-colors">DEPOSIT</button>
            <button className="inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80">
              <Globe className="h-[14px] w-[14px] text-gray-300" /><span className="font-bold text-gray-300 text-xs">EN</span><img className="w-4 h-4" alt="" src="/svg/arrow.svg" />
            </button>
            <button className="relative flex items-center justify-center bg-transparent border-none p-0 cursor-pointer hover:opacity-80" aria-label="Notifications">
              <img className="h-[18px] w-[18px]" alt="" src="/svg/bell.svg" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00FFA3]" />
            </button>
            <span className="font-bold text-[#00ffa3] text-[11.4px] tracking-[-0.40px] whitespace-nowrap">{displayName}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ffa3] text-xs font-bold text-[#0b0f14]">{initials}</div>
            <button className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer hover:opacity-80" onClick={() => { logout(); navigate("/"); }}><img className="w-[18px] h-[16px]" alt="Log out" src="/svg/button-log-out.svg" /></button>
          </div>
        </header>

        {/* ─── Main Grid ─── */}
        <div className="flex flex-1 p-2 gap-2 overflow-hidden min-h-0">
          <div className="flex flex-col flex-1 gap-2 overflow-hidden min-h-0">
            <div className="flex flex-[3] gap-2 overflow-hidden min-h-0">

              {/* Chart */}
              <GradientBorderPanel className="flex-1">
                <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#05070A] shrink-0 relative" ref={coinSelectorRef}>
                  <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setCoinSelectorOpen(o => !o)}>
                    <CoinIcon symbol={selectedCoin.symbol} color={selectedCoin.color} />
                    <span className="font-bold text-[15px] tracking-wide text-white">{selectedCoin.symbol}/USDT</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${coinSelectorOpen?"rotate-180":""}`} />
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isPositive?"text-[#00ffa3] bg-[#00ffa3]/10":"text-[#ff4d4d] bg-[#ff4d4d]/10"}`}>{isPositive?"+":""}{priceChangePercent}%</span>
                  </div>
                  {coinSelectorOpen && (
                    <div className="absolute top-full left-0 w-[340px] bg-[#0b0f14] border border-white/10 rounded-xl shadow-2xl z-[200] flex flex-col" style={{ maxHeight: 420 }}>
                      <div className="p-3 border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-2 bg-[#111820] rounded-lg px-3 py-2">
                          <Search className="w-4 h-4 text-gray-500 shrink-0" />
                          <input type="text" placeholder="Search coins..." value={coinSearch} onChange={e => setCoinSearch(e.target.value)} autoFocus
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 w-full" />
                          {coinSearch && <button onClick={() => setCoinSearch("")} className="text-gray-500 hover:text-white bg-transparent border-none cursor-pointer p-0"><X className="w-3.5 h-3.5" /></button>}
                        </div>
                      </div>
                      <div className={`overflow-y-auto flex-1 ${scrollbarCls}`} style={{ maxHeight: 360 }}>
                        {filteredCoins.map(coin => (
                          <div key={coin.symbol}
                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/5 ${coin.symbol===selectedCoin.symbol?"bg-[#00ffa3]/10":""}`}
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCoin(coin); setCoinSelectorOpen(false); setCoinSearch(""); }}>
                            <CoinIcon symbol={coin.symbol} color={coin.color} size={24} />
                            <div className="flex-1 min-w-0"><span className="text-sm font-semibold text-white">{coin.symbol}</span><span className="text-[11px] text-gray-500 ml-2">{coin.name}</span></div>
                            <span className="text-xs text-gray-400">{coin.pair}</span>
                          </div>
                        ))}
                        {!filteredCoins.length && <div className="px-4 py-6 text-center text-gray-500 text-sm">No coins found</div>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 relative bg-[#05070A] min-h-0" key={selectedCoin.pair}>
                  <AdvancedRealTimeChart theme="dark" symbol={`BINANCE:${selectedCoin.pair}`} interval="5" hide_legend allow_symbol_change={false} save_image={false} backgroundColor="#05070A" autosize />
                </div>
              </GradientBorderPanel>

              {/* Order Book */}
              <GradientBorderPanel width="273px">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                  <span className="text-[10px] font-bold text-[#A6B2C8] tracking-wider uppercase">Order Book</span>
                  <div className="flex bg-[#111820] rounded-[6px] p-0.5 gap-0.5">
                    {(["both","bids","asks"] as const).map(v => (
                      <button key={v} onClick={() => setOrderBookView(v)} className={`w-[28px] h-[22px] rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors p-0 ${orderBookView===v?"bg-[#2A3441]":"bg-transparent hover:bg-[#2A3441]"}`}>
                        <div className={`w-[14px] h-[10px] rounded-[2px] ${v==="both"?"bg-gradient-to-b from-[#ff4d4d] to-[#00ffa3]":v==="bids"?"bg-[#00ffa3]":"bg-[#ff4d4d]"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-4 py-1.5 shrink-0">
                  {["Price","Size","Sum"].map(h => <span key={h} className={`text-[8px] text-[#A6B2C8] font-semibold tracking-wide uppercase ${h!=="Price"?"text-right":""}`}>{h}</span>)}
                </div>
                {orderBookView !== "bids" && (
                  <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1 justify-end pb-1 border-b border-[#05070A]/50">
                    {(orderBookView==="asks"?asks:asks.slice(-14)).map((r,i) => (
                      <div key={`a${i}`} onClick={() => { setPriceInput(r.price.replace(/,/g,"")); setOrderType("Limit"); }} className="grid grid-cols-3 py-[2px] cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="text-[11px] text-[#ff4d4d] font-semibold">{r.price}</span>
                        <span className="text-[11px] text-gray-300 text-right font-mono">{r.size}</span>
                        <span className="text-[11px] text-gray-500 text-right font-mono">{r.total}</span>
                      </div>
                    ))}
                    {!asks.length && <div className="text-[10px] text-gray-600 flex-1 flex items-center justify-center">Loading...</div>}
                  </div>
                )}
                <div className="px-4 py-2 border-y border-white/5 flex items-center bg-[#05070A] shrink-0">
                  <span className={`text-[15px] font-bold ${isPositive?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{currentPrice}</span>
                </div>
                {orderBookView !== "asks" && (
                  <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1">
                    {(orderBookView==="bids"?bids:bids.slice(0,14)).map((r,i) => (
                      <div key={`b${i}`} onClick={() => { setPriceInput(r.price.replace(/,/g,"")); setOrderType("Limit"); }} className="grid grid-cols-3 py-[2px] cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="text-[11px] text-[#00ffa3] font-semibold">{r.price}</span>
                        <span className="text-[11px] text-gray-300 text-right font-mono">{r.size}</span>
                        <span className="text-[11px] text-gray-500 text-right font-mono">{r.total}</span>
                      </div>
                    ))}
                    {!bids.length && <div className="text-[10px] text-gray-600 flex-1 flex items-center justify-center">Loading...</div>}
                  </div>
                )}
              </GradientBorderPanel>
            </div>

            {/* ─── Bottom Panel: Positions / Orders / History ─── */}
            <GradientBorderPanel className="w-full shrink-0 flex-1 min-h-[200px]">
              <div className={`flex items-center gap-6 px-6 pt-3 border-b border-white/5 shrink-0 overflow-x-auto ${scrollbarCls}`}>
                {bottomTabs.map(tab => {
                  const on = bottomTab === tab.id;
                  return <button key={tab.id} onClick={() => setBottomTab(tab.id)} className={`pb-3 text-[11px] font-bold tracking-wider border-none cursor-pointer transition-all relative whitespace-nowrap ${on?"text-[#00ffa3]":"text-[#A6B2C8] hover:text-white"}`} style={{ background:"transparent" }}>
                    {tab.label}{on && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00ffa3] shadow-[0_0_8px_rgba(0,255,163,1)] rounded-t-full" />}
                  </button>;
                })}
              </div>

              {/* Tab content */}
              <div className={`flex-1 overflow-y-auto ${scrollbarCls}`}>
                {bottomTab === "positions" && (<>
                  <div className="grid grid-cols-8 gap-2 px-6 py-2 border-b border-white/5 shrink-0">
                    {["SYMBOL","SIZE","ENTRY PRICE","MARK PRICE","LIQ.PRICE","MARGIN","PNL (ROE%)",""].map(c => <span key={c} className="text-[10px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{c}</span>)}
                  </div>
                  {positions.length ? positions.map(pos => {
                    const mark = priceMap[pos.pair]||pos.entryPrice;
                    const pnl = calcPnl(pos, mark);
                    const roe = (pnl/pos.margin)*100;
                    const up = pnl >= 0;
                    const clr = pos.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]";
                    return <div key={pos.id} className="grid grid-cols-8 gap-2 py-2.5 px-6 border-b border-white/5 items-center">
                      <div className="flex items-center gap-1.5">
                        <CoinIcon symbol={pos.symbol} color={COINS.find(c=>c.symbol===pos.symbol)?.color||"#666"} size={16} />
                        <span className={`text-[11px] font-bold ${clr}`}>{pos.symbol} {pos.side==="long"?"Long":"Short"} {pos.leverage.toFixed(1)}x</span>
                      </div>
                      <span className={`text-[11px] font-semibold ${clr}`}>${fmt(pos.sizeUsdt)}</span>
                      <span className="text-[11px] text-white font-mono">{fmt(pos.entryPrice)}</span>
                      <span className={`text-[11px] font-mono ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{fmt(mark)}</span>
                      <span className="text-[11px] text-[#ff9500] font-mono">{fmt(pos.liqPrice)}</span>
                      <span className="text-[11px] text-white font-mono">${fmt(pos.margin)}</span>
                      <span className={`text-[11px] font-bold ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{up?"+":""}{pnl.toFixed(2)} ({up?"+":""}{roe.toFixed(2)}%)</span>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openTpSlModal(pos)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00ffa3] bg-[#09231c] hover:bg-[#0d2d23] px-3 py-1.5 rounded-md border border-[#00ffa3]/30 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                          <button onClick={() => closePosition(pos.id)} className="text-[12px] font-bold text-white bg-[#ff4d4d] hover:bg-[#ff6b6b] px-4 py-1.5 rounded-md border-none cursor-pointer transition-colors w-fit shadow-sm">Close</button>
                        </div>
                        {(pos.takeProfit != null || pos.stopLoss != null) && (
                          <span className="text-[9px] text-gray-400">
                            TP: {pos.takeProfit != null ? fmt(pos.takeProfit) : "—"} / SL: {pos.stopLoss != null ? fmt(pos.stopLoss) : "—"}
                          </span>
                        )}
                      </div>
                    </div>;
                  }) : <div className="flex flex-col items-center justify-center flex-1 gap-3 py-8"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg><span className="text-gray-500 text-[11px]">No Open Positions</span></div>}
                </>)}

                {bottomTab === "open-orders" && (<>
                  <div className="grid grid-cols-8 gap-2 px-6 py-2 border-b border-white/5">
                    {["SYMBOL","TYPE","SIDE","PRICE","SIZE","LEVERAGE","CREATED",""].map(c => <span key={c} className="text-[10px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{c}</span>)}
                  </div>
                  {pendingOrders.length ? pendingOrders.map(o => (
                    <div key={o.id} className="grid grid-cols-8 gap-2 py-2.5 px-6 border-b border-white/5 items-center">
                      <div className="flex items-center gap-1.5">
                        <CoinIcon symbol={o.symbol} color={COINS.find(c=>c.symbol===o.symbol)?.color||"#666"} size={16} />
                        <span className="text-[11px] font-bold text-white">{o.symbol}</span>
                      </div>
                      <span className="text-[11px] text-[#ffa500] font-bold uppercase">{o.type}</span>
                      <span className={`text-[11px] font-bold ${o.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{o.side==="long"?"Buy":"Sell"}</span>
                      <span className="text-[11px] text-white font-mono">{fmt(o.price)}</span>
                      <span className="text-[11px] text-white font-mono">${fmt(o.sizeUsdt)}</span>
                      <span className="text-[11px] text-[#00ffa3] font-bold">{o.leverage}x</span>
                      <span className="text-[11px] text-gray-400">{fmtDate(o.createdAt)}</span>
                      <button onClick={() => cancelOrder(o.id)} className="text-[10px] font-bold text-[#ff4d4d] hover:text-[#ff6666] bg-[#2a1520] hover:bg-[#3a2030] px-2.5 py-1 rounded-md border-none cursor-pointer transition-colors w-fit">Cancel</button>
                    </div>
                  )) : <div className="flex items-center justify-center py-8 text-gray-500 text-[11px]">No Open Orders</div>}
                </>)}

                {bottomTab === "order-history" && (<>
                  <div className="grid grid-cols-8 gap-2 px-6 py-2 border-b border-white/5">
                    {["SYMBOL","TYPE","SIDE","PRICE","SIZE","LEVERAGE","STATUS","DATE"].map(c => <span key={c} className="text-[10px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{c}</span>)}
                  </div>
                  {orderHistory.length ? orderHistory.map(o => (
                    <div key={o.id} className="grid grid-cols-8 gap-2 py-2.5 px-6 border-b border-white/5 items-center">
                      <span className="text-[11px] font-bold text-white">{o.symbol}</span>
                      <span className="text-[11px] text-[#ffa500] font-bold uppercase">{o.type}</span>
                      <span className={`text-[11px] font-bold ${o.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{o.side==="long"?"Buy":"Sell"}</span>
                      <span className="text-[11px] text-white font-mono">{fmt(o.price)}</span>
                      <span className="text-[11px] text-white font-mono">${fmt(o.sizeUsdt)}</span>
                      <span className="text-[11px] text-[#00ffa3] font-bold">{o.leverage}x</span>
                      <span className={`text-[11px] font-bold ${o.status==="filled"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{o.status.toUpperCase()}</span>
                      <span className="text-[11px] text-gray-400">{fmtDate(o.createdAt)}</span>
                    </div>
                  )) : <div className="flex items-center justify-center py-8 text-gray-500 text-[11px]">No Order History</div>}
                </>)}

                {bottomTab === "trade-history" && (<>
                  <div className="grid grid-cols-8 gap-2 px-6 py-2 border-b border-white/5">
                    {["SYMBOL","SIDE","ENTRY","EXIT","SIZE","PNL","OPENED","CLOSED"].map(c => <span key={c} className="text-[10px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{c}</span>)}
                  </div>
                  {tradeHistory.length ? tradeHistory.map(t => {
                    const up = t.pnl >= 0;
                    return <div key={t.id} className="grid grid-cols-8 gap-2 py-2.5 px-6 border-b border-white/5 items-center">
                      <span className="text-[11px] font-bold text-white">{t.symbol}</span>
                      <span className={`text-[11px] font-bold ${t.side==="long"?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{t.side==="long"?"Long":"Short"}</span>
                      <span className="text-[11px] text-white font-mono">{fmt(t.entryPrice)}</span>
                      <span className="text-[11px] text-white font-mono">{fmt(t.exitPrice)}</span>
                      <span className="text-[11px] text-white font-mono">${fmt(t.sizeUsdt)}</span>
                      <span className={`text-[11px] font-bold ${up?"text-[#00ffa3]":"text-[#ff4d4d]"}`}>{up?"+":""}{t.pnl.toFixed(2)}</span>
                      <span className="text-[11px] text-gray-400">{fmtDate(t.openedAt)}</span>
                      <span className="text-[11px] text-gray-400">{fmtDate(t.closedAt)}</span>
                    </div>;
                  }) : <div className="flex items-center justify-center py-8 text-gray-500 text-[11px]">No Trade History</div>}
                </>)}

                {bottomTab === "assets" && <div className="flex items-center justify-center py-8 text-gray-500 text-[11px]">Assets view coming soon</div>}
              </div>

              <div className="flex items-center justify-between px-6 py-2 border-t border-white/5 bg-[#05070A] shrink-0">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_5px_#00ffa3]" /><span className="text-[10.5px] text-[#afc0c9]">Connection: Secure</span></div>
                  <span className="text-[10.5px] text-[#89a4ad]">Server Time: {kyivTime} (Kyiv)</span>
                </div>
                <span className="text-[10px] text-[#A6B2C8] font-bold tracking-widest">UPDOWN PROTOCOL V2.4.1</span>
              </div>
            </GradientBorderPanel>
          </div>

          {/* ─── Right: Trade Panel ─── */}
          <GradientBorderPanel width="273px" className="shrink-0">
            <div className="flex flex-col h-full">
              {/* Scrollable content */}
              <div className={`flex-1 overflow-y-auto p-4 pb-0 min-h-0 ${scrollbarCls}`}>
                <span className="text-sm font-bold text-[#A6B2C8] tracking-wider uppercase mb-3 mt-1 block">Trade</span>
                <div className="flex gap-1 bg-[#111820] rounded-xl p-1 mb-3">
                  {(["Limit","Market","Trigger"] as const).map(t => (
                    <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg border-none cursor-pointer transition-colors ${orderType===t?"bg-[#00FFA3] text-[#05070A]":"bg-transparent text-gray-500 hover:text-white"}`}>{t}</button>
                  ))}
                </div>
                <div className="flex gap-2 mb-3 relative">
                  <div className="flex-1 relative">
                    <div onClick={() => { setMarginDropdownOpen(!marginDropdownOpen); setLeverageDropdownOpen(false); }}
                      className="bg-[#111820] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer border border-[#111820] hover:border-white/10">
                      <span className="text-[11px] text-white font-bold">{marginType}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="white"><path d="M0 0l5 6 5-6z"/></svg>
                    </div>
                    {marginDropdownOpen && <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-1">
                      {(["CROSS","ISOLATED"] as const).map(t => <div key={t} onClick={() => { setMarginType(t); setMarginDropdownOpen(false); }} className={`px-4 py-2 text-[11px] font-bold cursor-pointer transition-colors ${marginType===t?"text-[#00ffa3] bg-white/5":"text-white hover:bg-white/5"}`}>{t}</div>)}
                    </div>}
                  </div>
                  <div className="flex-1 relative">
                    <div onClick={() => { setLeverageDropdownOpen(!leverageDropdownOpen); setMarginDropdownOpen(false); }}
                      className="bg-[#111820] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer border border-[#111820] hover:border-white/10">
                      <span className="text-[11px] text-white font-bold">{leverage}x</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="white"><path d="M0 0l5 6 5-6z"/></svg>
                    </div>
                    {leverageDropdownOpen && <div className="absolute right-0 top-[calc(100%+4px)] w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-1">
                      {[1,2,3,4,5].map(v => <div key={v} onClick={() => { setLeverage(v); setLeverageDropdownOpen(false); }} className={`px-4 py-2 text-[11px] font-bold cursor-pointer transition-colors ${leverage===v?"text-[#00ffa3] bg-white/5":"text-white hover:bg-white/5"}`}>{v}x</div>)}
                    </div>}
                  </div>
                </div>

                {/* Trigger Price */}
                {orderType === "Trigger" && (
                  <div className="mb-2">
                    <div className="flex justify-between mb-1"><span className="text-[11px] text-gray-500 font-bold">Trigger Price</span><span className="text-[10px] text-gray-500">USDT</span></div>
                    <div className="flex gap-2">
                      <div className="bg-[#111820] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-[#00ffa3]/30 flex items-center flex-1">
                        <input type="number" value={triggerPriceInput} onChange={e => setTriggerPriceInput(e.target.value)} placeholder="0.00"
                          className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div className="relative w-[90px]">
                        <div onClick={() => setTriggerExecDropdownOpen(!triggerExecDropdownOpen)}
                          className="bg-[#111820] rounded-xl px-3 py-1.5 h-full flex items-center justify-between cursor-pointer border border-[#111820] hover:border-white/10">
                          <span className="text-[11px] text-white font-bold">{triggerExecType}</span>
                          <svg width="8" height="5" viewBox="0 0 10 6" fill="white"><path d="M0 0l5 6 5-6z"/></svg>
                        </div>
                        {triggerExecDropdownOpen && <div className="absolute right-0 top-[calc(100%+4px)] w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-1">
                          {(["Limit","Market"] as const).map(t => <div key={t} onClick={() => { setTriggerExecType(t); setTriggerExecDropdownOpen(false); }} className={`px-3 py-2 text-[11px] font-bold cursor-pointer transition-colors ${triggerExecType===t?"text-[#00ffa3] bg-white/5":"text-white hover:bg-white/5"}`}>{t}</div>)}
                        </div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Price */}
                {!(orderType === "Trigger" && triggerExecType === "Market") && (
                  <div className="mb-2">
                    <div className="flex justify-between mb-1"><span className="text-[11px] text-gray-500 font-bold">Price</span><span className="text-[10px] text-gray-500">USDT</span></div>
                    <div className="bg-[#111820] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-[#00ffa3]/30 flex items-center">
                      <input type="number" 
                        value={orderType==="Market" ? (priceNumeric > 0 ? priceNumeric.toFixed(2) : "") : priceInput} 
                        onChange={e => setPriceInput(e.target.value)} 
                        placeholder={orderType==="Market"?"Market Price":"0.00"} 
                        disabled={orderType==="Market"}
                        className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-white placeholder-gray-700 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                )}

                {/* Size (USDT) */}
                <div className="mb-2">
                  <div className="flex justify-between mb-1"><span className="text-[11px] text-gray-500 font-bold">Size</span><span className="text-[10px] text-gray-500">USDT</span></div>
                  <div className="bg-[#111820] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-[#00ffa3]/30 flex items-center">
                    <input type="number" value={sizeInput} onChange={e => handleSizeChange(e.target.value)} placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-2 px-1">
                  <input type="range" min="0" max="100" value={percent} onChange={e => handleSliderChange(Number(e.target.value))}
                    className="trade-slider"
                    style={{ background: `linear-gradient(to right,#00FFA3 ${percent}%,#111820 ${percent}%)` }} />
                  <div className="flex justify-between items-center mt-1.5">
                    {[0,25,50,75,100].map(p => <button key={p} onClick={() => handleSliderChange(p)} className={`text-[9px] font-bold bg-transparent border-none cursor-pointer ${percent===p?"text-[#00FFA3]":"text-gray-500 hover:text-white"}`}>{p}%</button>)}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex flex-col gap-1 py-2 border-t border-white/5 text-[11px]">
                  <div className="flex justify-between"><span className="text-gray-500">Margin</span><span className="font-semibold text-white">{sizeInput && parseFloat(sizeInput) > 0 ? fmt(parseFloat(sizeInput)/leverage) : "0.00"} USDT</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Leverage</span><span className="font-semibold text-[#00ffa3]">{leverage}x</span></div>
                  {sizeInput && parseFloat(sizeInput) > 0 && priceNumeric > 0 && <>
                    <div className="flex justify-between"><span className="text-gray-500">Liq. (Long)</span><span className="font-semibold text-[#ff9500]">{fmt(calcLiqPrice(priceNumeric, leverage, "long"))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Liq. (Short)</span><span className="font-semibold text-[#ff9500]">{fmt(calcLiqPrice(priceNumeric, leverage, "short"))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Size in {selectedCoin.symbol}</span><span className="font-semibold text-white">{(parseFloat(sizeInput)/priceNumeric).toFixed(6)}</span></div>
                  </>}
                  <div className="flex justify-between"><span className="text-gray-500">Fee (0.04%)</span><span className="font-semibold text-white">{sizeInput && parseFloat(sizeInput) > 0 ? fmt(parseFloat(sizeInput)*0.0004) : "0.00"} USDT</span></div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[11px] text-gray-500">Available Balance</span>
                  <span className="text-[11px] font-bold text-white">{fmt(availableBalance)} USDT</span>
                </div>
              </div>

              {/* Pinned Buttons */}
              <div className="flex flex-col gap-2 p-4 pt-2 shrink-0">
                <button onClick={() => openTrade("long")} className="w-full h-[42px] rounded-[10px] bg-gradient-to-b from-[#00FFA3] to-[#009962] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.3)]">
                  <span className="font-bold text-[#05070a] text-[14px] tracking-wide leading-none mb-0.5">{orderType==="Market"?"BUY / LONG":`${orderType.toUpperCase()} BUY`}</span>
                  <span className="text-[8px] text-[#05070a]/80 font-bold tracking-widest uppercase leading-none">PRICE: {orderType==="Market"?currentPrice:priceInput||"—"}</span>
                </button>
                <button onClick={() => openTrade("short")} className="w-full h-[42px] rounded-[10px] bg-gradient-to-b from-[#FF3B3B] to-[#992323] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,59,59,0.3)]">
                  <span className="font-bold text-white text-[14px] tracking-wide leading-none mb-0.5">{orderType==="Market"?"SELL / SHORT":`${orderType.toUpperCase()} SELL`}</span>
                  <span className="text-[8px] text-white/80 font-bold tracking-widest uppercase leading-none">PRICE: {orderType==="Market"?currentPrice:priceInput||"—"}</span>
                </button>
              </div>
            </div>
          </GradientBorderPanel>
        </div>
      </div>
    </div>

    {modalPosition && (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 min-[375px]:p-4"
        onClick={closeTpSlModal}
      >
        <div
          className="w-full max-w-[620px] rounded-2xl border border-[#1f2730] bg-[#0B0F14] shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 min-[375px]:px-5 py-3 min-[375px]:py-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 min-[375px]:h-8 min-[375px]:w-8 rounded-lg bg-[#102f25] border border-[#00ffa3]/35 text-[#00ffa3] flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-[16px] min-[375px]:text-[18px] font-semibold text-white">Add TP/SL</h3>
            </div>
            <button
              type="button"
              onClick={closeTpSlModal}
              className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
              aria-label="Close TP/SL modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 min-[375px]:px-5 py-4 min-[375px]:py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-white/8 bg-[#101722] px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Entry Price</div>
                <div className="text-[14px] font-semibold text-white">{fmt(modalPosition.entryPrice)}</div>
              </div>
              <div className="rounded-lg border border-white/8 bg-[#101722] px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Size</div>
                <div className="text-[14px] font-semibold text-white">${fmt(modalPosition.sizeUsdt)}</div>
              </div>
              <div className="rounded-lg border border-white/8 bg-[#101722] px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Mark Price</div>
                <div className="text-[14px] font-semibold text-white">{fmt(modalMarkPrice)}</div>
              </div>
              <div className="rounded-lg border border-white/8 bg-[#101722] px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Liq. Price</div>
                <div className="text-[14px] font-semibold text-[#ff9500]">{fmt(modalPosition.liqPrice)}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#1a2835] bg-[#0f141d] p-3 min-[375px]:p-4">
              <div className="mb-1 text-[12px] font-semibold text-white">Take Profit (TP)</div>
              <div className="text-[10px] text-gray-500 mb-2">
                {modalPosition.side === "long" ? "For Long: TP should be above entry." : "For Short: TP should be below entry."}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={tpInput}
                  onChange={(e) => setTpInput(e.target.value)}
                  placeholder="Trigger price"
                  className="w-full rounded-lg border border-white/10 bg-[#151d29] px-3 py-2.5 pr-12 text-[14px] text-white outline-none focus:border-[#00ffa3]/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400">USDT</span>
              </div>
              {Number.isFinite(modalTpValue) && (
                <div className={`mt-2 text-[11px] font-semibold ${calcRoiFromPrice(modalPosition, modalTpValue) >= 0 ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>
                  Estimated ROE: {calcRoiFromPrice(modalPosition, modalTpValue) >= 0 ? "+" : ""}
                  {calcRoiFromPrice(modalPosition, modalTpValue).toFixed(2)}%
                </div>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-[#1a2835] bg-[#0f141d] p-3 min-[375px]:p-4">
              <div className="mb-1 text-[12px] font-semibold text-white">Stop Loss (SL)</div>
              <div className="text-[10px] text-gray-500 mb-2">
                {modalPosition.side === "long" ? "For Long: SL should be below entry." : "For Short: SL should be above entry."}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={slInput}
                  onChange={(e) => setSlInput(e.target.value)}
                  placeholder="Trigger price"
                  className="w-full rounded-lg border border-white/10 bg-[#151d29] px-3 py-2.5 pr-12 text-[14px] text-white outline-none focus:border-[#00ffa3]/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400">USDT</span>
              </div>
              {Number.isFinite(modalSlValue) && (
                <div className={`mt-2 text-[11px] font-semibold ${calcRoiFromPrice(modalPosition, modalSlValue) >= 0 ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>
                  Estimated ROE: {calcRoiFromPrice(modalPosition, modalSlValue) >= 0 ? "+" : ""}
                  {calcRoiFromPrice(modalPosition, modalSlValue).toFixed(2)}%
                </div>
              )}
            </div>

            {tpslError && (
              <div className="mt-3 rounded-lg border border-[#ff4d4d]/35 bg-[#2a1318] px-3 py-2 text-[12px] text-[#ff8e8e]">
                {tpslError}
              </div>
            )}

            <div className="mt-4 flex flex-col min-[375px]:flex-row gap-2">
              <button
                type="button"
                onClick={saveTpSl}
                disabled={tpslSaving}
                className="flex-1 rounded-xl bg-[#00ffa3] px-4 py-2.5 text-[13px] font-bold text-[#04140f] border-none cursor-pointer hover:bg-[#00e693] disabled:opacity-65 disabled:cursor-not-allowed transition-colors"
              >
                {tpslSaving ? "Saving..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={closeTpSlModal}
                disabled={tpslSaving}
                className="flex-1 rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-[13px] font-semibold text-white cursor-pointer hover:bg-white/5 disabled:opacity-65 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>);
};
