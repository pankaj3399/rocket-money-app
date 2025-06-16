"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import IncomeTaxCalculator from "@/components/calculations/IncomeTaxCalculator";
import CurrencyConverter from "@/components/calculations/CurrencyConverter";
import InvestmentCalculator from "@/components/calculations/InvestmentCalculator";
import LoanCalculator from "@/components/calculations/LoanCalculator";
import StockSimulator from "@/components/calculations/StockSimulator";

const CalculationsPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Financial Calculators</h1>
          <p className="text-muted-foreground">
            Calculate taxes, convert currencies, plan investments, and simulate stock trading
          </p>
        </div>

        <Tabs defaultValue="tax" className="space-y-6">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="loan">Loan</TabsTrigger>
            <TabsTrigger value="tax">Income Tax</TabsTrigger>
            <TabsTrigger value="stocks">Stock Simulator</TabsTrigger>
          </TabsList>


          <TabsContent value="currency">
            <CurrencyConverter />
          </TabsContent>

          <TabsContent value="investment">
            <InvestmentCalculator />
          </TabsContent>

          <TabsContent value="loan">
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="tax">
            <IncomeTaxCalculator />
          </TabsContent>

          <TabsContent value="stocks">
            <StockSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CalculationsPage;