import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Trash2 } from "lucide-react";

const StockSimulator = () => {
  const [stockSimulator, setStockSimulator] = useState({
    symbol: "",
    quantity: "",
    purchasePrice: "",
  });
  const [portfolio, setPortfolio] = useState([]);

  const addToPortfolio = () => {
    if (!stockSimulator.symbol || !stockSimulator.quantity || !stockSimulator.purchasePrice) {
      alert("Please fill in all fields");
      return;
    }

    const newStock = {
      symbol: stockSimulator.symbol,
      quantity: parseFloat(stockSimulator.quantity),
      purchasePrice: parseFloat(stockSimulator.purchasePrice),
      timestamp: Date.now(),
    };

    setPortfolio([...portfolio, newStock]);
    setStockSimulator({
      symbol: "",
      quantity: "",
      purchasePrice: "",
    });
  };

  const removeFromPortfolio = (timestamp) => {
    setPortfolio(portfolio.filter((stock) => stock.timestamp !== timestamp));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, stock) => {
      return total + stock.quantity * stock.purchasePrice;
    }, 0);
  };

  return (
    <div className="bg-background flex items-center justify-start">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              Stock Simulator
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Simulate stock purchases and track your portfolio
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Symbol</label>
                <Input
                  placeholder="Enter stock symbol"
                  value={stockSimulator.symbol}
                  onChange={(e) =>
                    setStockSimulator({
                      ...stockSimulator,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={stockSimulator.quantity}
                  onChange={(e) =>
                    setStockSimulator({
                      ...stockSimulator,
                      quantity: e.target.value,
                    })
                  }
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Price ($)</label>
                <Input
                  type="number"
                  placeholder="Enter purchase price"
                  value={stockSimulator.purchasePrice}
                  onChange={(e) =>
                    setStockSimulator({
                      ...stockSimulator,
                      purchasePrice: e.target.value,
                    })
                  }
                  className="text-lg"
                />
              </div>
              <Button
                onClick={addToPortfolio}
                className="w-full h-12 text-base font-medium"
              >
                Add to Portfolio
              </Button>
            </div>

            {portfolio.length > 0 && (
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 border border-border rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">
                        Portfolio Value: {formatCurrency(calculatePortfolioValue())}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {portfolio.length} stocks in portfolio
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {portfolio.map((stock) => {
                    const totalValue = stock.quantity * stock.purchasePrice;
                    return (
                      <div
                        key={stock.timestamp}
                        className="p-4 bg-muted/50 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{stock.symbol}</h3>
                              <p className="text-sm text-muted-foreground">
                                {stock.quantity} shares
                              </p>
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
                            Price: {formatCurrency(stock.purchasePrice)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: {formatCurrency(totalValue)}
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

export default StockSimulator; 