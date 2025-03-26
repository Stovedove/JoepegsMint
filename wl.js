require("dotenv").config();
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const TRANSACTIONS_PER_SECOND = 2; 

const ABI = [
    "function allowlistMint(uint256 _quantity) payable"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function intentarMintear() {
    try {
        console.log("Intentando mintear...");

        const options = { value: ethers.parseEther("5"), gasLimit: 300000 };
        const tx = await contract.allowlistMint(1, options);

        console.log(`🚀 Transacción enviada: ${tx.hash}`);
        await tx.wait();
        console.log("✅ Minteo exitoso. Deteniendo intentos.");
        process.exit(0);
    } catch (error) {
        console.log("⚠️ Fallo en la transacción, reintentando...");
    }
}

function iniciarIntentos() {
    console.log(`📡 Iniciando spam de transacciones (${TRANSACTIONS_PER_SECOND} por segundo)...`);

    const intervalo = setInterval(() => {
        intentarMintear();
    }, 1000 / TRANSACTIONS_PER_SECOND); 

    setTimeout(() => {
        clearInterval(intervalo);
        console.log("❌ Tiempo agotado. Deteniendo intentos.");
        process.exit(1);
    }, 1000000);
}

iniciarIntentos();
