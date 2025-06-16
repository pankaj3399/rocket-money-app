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

const CurrencyConverter = () => {
  const [currency, setCurrency] = useState({
    amount: "",
    fromCurrency: "USD",
    toCurrency: "EUR",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const apiKey = "d081e8e4d0669466b2a9e1e7";
  const baseUrl = "https://v6.exchangerate-api.com/v6";

  // Fetch exchange rates when component mounts or base currency changes
  useEffect(() => {
    fetchExchangeRates(currency.fromCurrency);
  }, [currency.fromCurrency]);

  const fetchExchangeRates = async (baseCurrency) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${baseUrl}/${apiKey}/latest/${baseCurrency}`
      );
      const data = await response.json();

      if (data.result === "success") {
        setExchangeRates(data.conversion_rates);
        setLastUpdated(new Date(data.time_last_update_utc));
      } else {
        setError("Failed to fetch exchange rates");
      }
    } catch (err) {
      setError("Network error: Unable to fetch exchange rates");
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    if (
      !currency.amount ||
      isNaN(currency.amount) ||
      parseFloat(currency.amount) <= 0
    ) {
      setError("Please enter a valid amount");
      return;
    }

    if (!exchangeRates[currency.toCurrency]) {
      setError("Exchange rate not available");
      return;
    }

    const amount = parseFloat(currency.amount);
    const rate = exchangeRates[currency.toCurrency];
    const convertedAmount = amount * rate;

    setResult({
      originalAmount: amount,
      convertedAmount: convertedAmount,
      fromCurrency: currency.fromCurrency,
      toCurrency: currency.toCurrency,
      rate: rate,
    });
    setError(null);
  };

  const swapCurrencies = () => {
    setCurrency({
      ...currency,
      fromCurrency: currency.toCurrency,
      toCurrency: currency.fromCurrency,
    });
    setResult(null);
  };

  // Popular currencies list
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł" },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  ];

  const getCurrencySymbol = (code) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="bg-background flex items-center justify-start ">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              Currency Converter
            </CardTitle>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={currency.amount}
                onChange={(e) =>
                  setCurrency({ ...currency, amount: e.target.value })
                }
                min="0"
                step="any"
                className="text-lg"
              />
            </div>

            <div className=" flex items-center gap-6 justify-between">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">From</label>
                <Select
                  value={currency.fromCurrency}
                  onValueChange={(value) =>
                    setCurrency({ ...currency, fromCurrency: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center space-y-2 mt-4 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={swapCurrencies}
                  className="px-4 py-2 rounded-full hover:bg-muted"
                >
                  ⇅ Swap
                </Button>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">To</label>
                <Select
                  value={currency.toCurrency}
                  onValueChange={(value) =>
                    setCurrency({ ...currency, toCurrency: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-medium"
              onClick={convertCurrency}
              disabled={loading || !currency.amount}
            >
              {loading ? "Converting..." : "Convert Currency"}
            </Button>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}

            {result && (
              <div className="p-6 bg-muted/50 border border-border rounded-lg">
                <div className="text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      {getCurrencySymbol(result.fromCurrency)}{" "}
                      {result.originalAmount.toLocaleString()}{" "}
                      {result.fromCurrency}
                    </p>
                    <div className="text-muted-foreground">
                      <span className="text-2xl">↓</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {getCurrencySymbol(result.toCurrency)}{" "}
                      {result.convertedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}{" "}
                      {result.toCurrency}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      1 {result.fromCurrency} = {result.rate.toFixed(6)}{" "}
                      {result.toCurrency}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;
