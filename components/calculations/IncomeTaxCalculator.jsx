import React, { useState } from "react";
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
import { Calculator } from "lucide-react";

const IncomeTaxCalculator = () => {
  const [incomeTax, setIncomeTax] = useState({
    income: "",
    deductions: "",
    taxYear: "2024",
  });

  const calculateTax = () => {
    // Basic tax calculation logic (simplified)
    const taxableIncome = parseFloat(incomeTax.income) - parseFloat(incomeTax.deductions || 0);
    let tax = 0;

    if (taxableIncome <= 0) return 0;

    // 2024 Tax brackets (simplified)
    if (taxableIncome <= 11600) {
      tax = taxableIncome * 0.10;
    } else if (taxableIncome <= 47150) {
      tax = 1160 + (taxableIncome - 11600) * 0.12;
    } else if (taxableIncome <= 100525) {
      tax = 5423 + (taxableIncome - 47150) * 0.22;
    } else if (taxableIncome <= 191950) {
      tax = 17196 + (taxableIncome - 100525) * 0.24;
    } else if (taxableIncome <= 243725) {
      tax = 39104 + (taxableIncome - 191950) * 0.32;
    } else if (taxableIncome <= 609350) {
      tax = 55644 + (taxableIncome - 243725) * 0.35;
    } else {
      tax = 183647 + (taxableIncome - 609350) * 0.37;
    }

    return tax;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const taxAmount = calculateTax();
  const taxableIncome = parseFloat(incomeTax.income) - parseFloat(incomeTax.deductions || 0);
  const effectiveTaxRate = taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0;

  return (
    <div className="bg-background flex items-center justify-start">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              Income Tax Calculator
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Calculate your estimated tax liability for {incomeTax.taxYear}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Income</label>
                <Input
                  type="number"
                  placeholder="Enter your annual income"
                  value={incomeTax.income}
                  onChange={(e) =>
                    setIncomeTax({ ...incomeTax, income: e.target.value })
                  }
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deductions</label>
                <Input
                  type="number"
                  placeholder="Enter total deductions"
                  value={incomeTax.deductions}
                  onChange={(e) =>
                    setIncomeTax({ ...incomeTax, deductions: e.target.value })
                  }
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Year</label>
                <Select
                  value={incomeTax.taxYear}
                  onValueChange={(value) =>
                    setIncomeTax({ ...incomeTax, taxYear: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {incomeTax.income && (
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 border border-border rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        Taxable Income: {formatCurrency(taxableIncome)}
                      </p>
                      <div className="text-muted-foreground">
                        <span className="text-2xl">↓</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        Estimated Tax: {formatCurrency(taxAmount)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Effective Tax Rate: {effectiveTaxRate.toFixed(2)}%
                      </p>
                    </div>
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

export default IncomeTaxCalculator; 