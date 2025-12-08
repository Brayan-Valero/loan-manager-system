package com.loanmanager.service;

import com.loanmanager.entity.Loan;
import com.loanmanager.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanRepository loanRepository;

    public Loan createLoan(Loan loan) {
        // Calcular cuota mensual
        loan.setMonthlyInstallment(calculateMonthlyInstallment(
                loan.getPrincipalAmount(),
                loan.getInterestRate(),
                loan.getNumberOfInstallments()
        ));
        return loanRepository.save(loan);
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan updateLoan(Long id, Loan loanDetails) {
        Loan loan = getLoanById(id);
        loan.setStatus(loanDetails.getStatus());
        loan.setBalance(loanDetails.getBalance());
        loan.setPaidInstallments(loanDetails.getPaidInstallments());
        return loanRepository.save(loan);
    }

    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }

    public BigDecimal calculateMonthlyInstallment(BigDecimal principal, BigDecimal annualRate, Integer months) {
        // Fórmula: cuota = principal * (tasa * (1 + tasa)^n) / ((1 + tasa)^n - 1)
        // donde tasa es la tasa mensual
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);
        }

        BigDecimal numerator = monthlyRate.multiply(
                monthlyRate.add(BigDecimal.ONE).pow(months)
        );
        BigDecimal denominator = monthlyRate.add(BigDecimal.ONE).pow(months).subtract(BigDecimal.ONE);
        
        return principal.multiply(numerator).divide(denominator, 2, RoundingMode.HALF_UP);
    }

    public java.util.List<java.util.Map<String, Object>> calculateAmortizationSchedule(BigDecimal principal, BigDecimal annualRate, Integer months, java.time.LocalDate startDate) {
        java.util.List<java.util.Map<String, Object>> schedule = new java.util.ArrayList<>();
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal monthlyInstallment = calculateMonthlyInstallment(principal, annualRate, months);

        BigDecimal balance = principal.setScale(2, RoundingMode.HALF_UP);

        for (int i = 1; i <= months; i++) {
            BigDecimal interest = balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalPaid = monthlyInstallment.subtract(interest).setScale(2, RoundingMode.HALF_UP);
            if (principalPaid.compareTo(balance) > 0) {
                principalPaid = balance;
            }
            BigDecimal payment = interest.add(principalPaid).setScale(2, RoundingMode.HALF_UP);
            balance = balance.subtract(principalPaid).setScale(2, RoundingMode.HALF_UP);
            java.time.LocalDate paymentDate = null;
            if (startDate != null) paymentDate = startDate.plusMonths(i);

            java.util.Map<String, Object> entry = new java.util.LinkedHashMap<>();
            entry.put("installment", i);
            entry.put("paymentDate", paymentDate == null ? null : paymentDate.toString());
            entry.put("payment", payment);
            entry.put("interest", interest);
            entry.put("principal", principalPaid);
            entry.put("balance", balance);

            schedule.add(entry);
        }

        return schedule;
    }
}
