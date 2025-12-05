package com.loanmanager.controller;

import com.loanmanager.entity.Loan;
import com.loanmanager.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody Loan loan) {
        return ResponseEntity.ok(loanService.createLoan(loan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id, @RequestBody Loan loanDetails) {
        return ResponseEntity.ok(loanService.updateLoan(id, loanDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulateLoan(@RequestBody Map<String, Object> request) {
        BigDecimal principal = new BigDecimal(request.get("principal").toString());
        BigDecimal rate = new BigDecimal(request.get("rate").toString());
        Integer months = ((Number) request.get("months")).intValue();

        BigDecimal monthlyInstallment = loanService.calculateMonthlyInstallment(principal, rate, months);
        BigDecimal totalToPay = monthlyInstallment.multiply(BigDecimal.valueOf(months));
        BigDecimal totalInterest = totalToPay.subtract(principal);

        return ResponseEntity.ok(Map.of(
                "monthlyInstallment", monthlyInstallment,
                "totalToPay", totalToPay,
                "totalInterest", totalInterest
        ));
    }
}
