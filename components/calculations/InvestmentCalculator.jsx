import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Trash2, Coins } from "lucide-react";
import Image from "next/image";

const PortfolioTracker = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockPrices, setStockPrices] = useState({});
  const [stockLogos, setStockLogos] = useState({});

  // Popular stocks list
  const popularStocks = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "binancecoin", symbol: "BNB", name: "BNB" },
    { id: "cardano", symbol: "ADA", name: "Cardano" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "polkadot", symbol: "DOT", name: "Polkadot" },
    { id: "chainlink", symbol: "LINK", name: "Chainlink" },
    { id: "litecoin", symbol: "LTC", name: "Litecoin" },
    { id: "polygon", symbol: "MATIC", name: "Polygon" },
    { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  ];

  // Fetch logos for all popular cryptocurrencies when component mounts
  useEffect(() => {
    const fetchAllStockLogos = async () => {
      try {
        const stockIds = popularStocks.map(stock => stock.id).join(",");
        console.log("Fetching logos for all cryptocurrencies:", stockIds);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${stockIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        const data = await response.json();
        console.log("CoinGecko API response for all logos:", data);
        const logos = {};
        data.forEach((coin) => {
          if (coin.image && coin.image.startsWith('https://')) {
            logos[coin.id] = coin.image;
            console.log(`Logo URL for ${coin.id}:`, coin.image);
          } else {
            console.warn(`Invalid image URL for ${coin.id}:`, coin.image);
          }
        });
        setStockLogos(logos);
      } catch (error) {
        console.error("Error fetching all stock logos:", error);
      }
    };

    fetchAllStockLogos();
  }, []);

  // Fetch current prices for portfolio stocks
  useEffect(() => {
    if (portfolio.length > 0) { 
      fetchStockPrices();
    }
  }, [portfolio]);

  const fetchStockPrices = async () => {
    try {
      const stockIds = portfolio.map((item) => item.id).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${stockIds}&vs_currencies=usd`
      );
      const data = await response.json();
      setStockPrices(data);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    }
  };

  const DefaultCryptoIcon = ({ size = 24 }) => (
    <div className="flex items-center justify-center bg-muted rounded-full" style={{ width: size, height: size }}>
      <Coins className="w-4 h-4 text-muted-foreground" />
    </div>
  );

  const CryptoImage = ({ src, alt, size = 24 }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
      return <DefaultCryptoIcon size={size} />;
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full"
        onError={() => setError(true)}
      />
    );
  };

  const addToPortfolio = async () => {
    if (!selectedStock || !stockQuantity || !purchasePrice) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const stock = popularStocks.find((s) => s.id === selectedStock);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedStock}&vs_currencies=usd`
      );
      const data = await response.json();
      const currentPrice = data[selectedStock]?.usd || 0;

      const newStock = {
        id: selectedStock,
        symbol: stock.symbol,
        name: stock.name,
        quantity: parseFloat(stockQuantity),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: currentPrice,
        timestamp: Date.now(),
      };

      setPortfolio([...portfolio, newStock]);
      setSelectedStock("");
      setStockQuantity("");
      setPurchasePrice("");
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Error fetching stock price. Please try again.");
    }
    setLoading(false);
  };

  const removeFromPortfolio = (timestamp) => {
    setPortfolio(portfolio.filter((stock) => stock.timestamp !== timestamp));
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, stock) => {
      const currentPrice = stockPrices[stock.id]?.usd || stock.currentPrice;
      return total + stock.quantity * currentPrice;
    }, 0);
  };

  const calculatePortfolioGainLoss = () => {
    const currentValue = calculatePortfolioValue();
    const investedValue = portfolio.reduce((total, stock) => {
      return total + stock.quantity * stock.purchasePrice;
    }, 0);
    return currentValue - investedValue;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-background flex items-center justify-start">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              Cryptocurrency Portfolio Tracker
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your cryptocurrency investments and monitor their performance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Cryptocurrency</label>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose cryptocurrency">
                      {selectedStock && (
                        <div className="flex items-center gap-2">
                          <CryptoImage
                            src={stockLogos[selectedStock]}
                            alt={popularStocks.find(s => s.id === selectedStock)?.name || ""}
                            size={24}
                          />
                          <span>{popularStocks.find(s => s.id === selectedStock)?.symbol}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {popularStocks.map((stock) => (
                      <SelectItem key={stock.id} value={stock.id}>
                        <div className="flex items-center gap-2">
                          <CryptoImage
                            src={stockLogos[stock.id]}
                            alt={stock.name}
                            size={24}
                          />
                          <span>{stock.symbol} - {stock.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  step="0.01"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Price ($)</label>
                <Input
                  type="number"
                  placeholder="Enter purchase price"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={addToPortfolio}
                disabled={loading}
                className="w-full h-12 text-base font-medium"
              >
                {loading ? "Adding..." : "Add to Portfolio"}
              </Button>
            </div>

            {portfolio.length > 0 && (
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 border border-border rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        Total Invested: {formatCurrency(
                          portfolio.reduce(
                            (total, stock) =>
                              total + stock.quantity * stock.purchasePrice,
                            0
                          )
                        )}
                      </p>
                      <div className="text-muted-foreground">
                        <span className="text-2xl">↓</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        Current Value: {formatCurrency(calculatePortfolioValue())}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className={`text-sm ${calculatePortfolioGainLoss() >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {calculatePortfolioGainLoss() >= 0 ? "+" : ""}
                        {formatCurrency(calculatePortfolioGainLoss())} (
                        {((calculatePortfolioGainLoss() / portfolio.reduce(
                          (total, stock) =>
                            total + stock.quantity * stock.purchasePrice,
                          0
                        )) * 100).toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {portfolio.map((stock) => {
                    const currentPrice = stockPrices[stock.id]?.usd || stock.currentPrice;
                    const currentValue = stock.quantity * currentPrice;
                    const investedValue = stock.quantity * stock.purchasePrice;
                    const gainLoss = currentValue - investedValue;
                    const gainLossPercent = (gainLoss / investedValue) * 100;

                    return (
                      <div
                        key={stock.timestamp}
                        className="p-4 bg-muted/50 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CryptoImage
                              src={stockLogos[stock.id]}
                              alt={stock.name}
                              size={32}
                            />
                            <div>
                              <h3 className="font-semibold">{stock.symbol}</h3>
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromPortfolio(stock.timestamp)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            Quantity: {stock.quantity} × {formatCurrency(currentPrice)} = {formatCurrency(currentValue)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Purchase: {formatCurrency(stock.purchasePrice)} × {stock.quantity} = {formatCurrency(investedValue)}
                          </p>
                          <p className={`text-sm ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss)} ({gainLossPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioTracker;
