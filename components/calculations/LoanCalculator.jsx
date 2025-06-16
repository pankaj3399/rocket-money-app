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
import { Calculator, DollarSign, Clock, Percent } from "lucide-react";

const LoanCalculator = () => {
  const [loan, setLoan] = useState({
    principal: "",
    interestRate: "",
    term: "",
    termType: "years",
    loanType: "fixed",
  });

  const [results, setResults] = useState(null);

  const calculatePayments = () => {
    const principal = parseFloat(loan.principal);
    const annualRate = parseFloat(loan.interestRate) / 100;
    const termInMonths =
      loan.termType === "years"
        ? parseFloat(loan.term) * 12
        : parseFloat(loan.term);

    if (!principal || !annualRate || !termInMonths) {
      alert("Please fill in all fields with valid numbers");
      return;
    }

    // Monthly interest rate
    const monthlyRate = annualRate / 12;

    let monthlyPayment;
    let totalPayment;
    let totalInterest;

    if (loan.loanType === "fixed") {
      // Fixed rate loan calculation using standard amortization formula
      if (monthlyRate === 0) {
        monthlyPayment = principal / termInMonths;
      } else {
        monthlyPayment =
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, termInMonths))) /
          (Math.pow(1 + monthlyRate, termInMonths) - 1);
      }
      totalPayment = monthlyPayment * termInMonths;
      totalInterest = totalPayment - principal;
    } else {
      // Interest-only loan calculation
      monthlyPayment = principal * monthlyRate;
      totalPayment = monthlyPayment * termInMonths + principal;
      totalInterest = monthlyPayment * termInMonths;
    }

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
    });
  };

  const resetCalculator = () => {
    setLoan({
      principal: "",
      interestRate: "",
      term: "",
      termType: "years",
      loanType: "fixed",
    });
    setResults(null);
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
              Loan Calculator
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Calculate your monthly payments for fixed-rate or interest-only loans
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="number"
                    placeholder="e.g., 250000"
                    value={loan.principal}
                    onChange={(e) =>
                      setLoan({ ...loan, principal: e.target.value })
                    }
                    className="pl-9 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Interest Rate</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 6.5"
                    value={loan.interestRate}
                    onChange={(e) =>
                      setLoan({ ...loan, interestRate: e.target.value })
                    }
                    className="pl-9 text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loan Term</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      value={loan.term}
                      onChange={(e) => setLoan({ ...loan, term: e.target.value })}
                      className="pl-9 text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Term Type</label>
                  <Select
                    value={loan.termType}
                    onValueChange={(value) => setLoan({ ...loan, termType: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select term type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Type</label>
                <Select
                  value={loan.loanType}
                  onValueChange={(value) => setLoan({ ...loan, loanType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                    <SelectItem value="interest-only">Interest Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculatePayments} className="flex-1 h-12 text-base font-medium">
                  Calculate Payments
                </Button>
                <Button onClick={resetCalculator} variant="outline" className="h-12">
                  Reset
                </Button>
              </div>
            </div>

            {results && (
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 border border-border rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        Monthly Payment: {formatCurrency(results.monthlyPayment)}
                      </p>
                      <div className="text-muted-foreground">
                        <span className="text-2xl">↓</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        Total Payment: {formatCurrency(results.totalPayment)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Total Interest: {formatCurrency(results.totalInterest)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Principal Amount: {formatCurrency(results.principal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 border border-border rounded-lg">
                  <h3 className="font-medium mb-2">Loan Summary</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Loan Type:</span>{" "}
                      {loan.loanType === "fixed" ? "Fixed Rate Loan" : "Interest Only Loan"}
                    </p>
                    <p>
                      <span className="font-medium">Interest Rate:</span>{" "}
                      {loan.interestRate}% annually
                    </p>
                    <p>
                      <span className="font-medium">Term:</span> {loan.term}{" "}
                      {loan.termType}
                    </p>
                    {loan.loanType === "interest-only" && (
                      <p className="text-orange-600 font-medium">
                        Note: Interest-only payments do not reduce the principal balance.
                        The full principal amount will be due at the end of the term.
                      </p>
                    )}
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

export default LoanCalculator;
