package com.loanmanager.service;

import com.loanmanager.entity.Loan;
import com.loanmanager.entity.Payment;
import com.loanmanager.repository.LoanRepository;
import com.loanmanager.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;

    public Payment createPayment(Payment payment) {
        // Aplicar lógica de amortización simple: calcular interés mensual sobre el saldo,
        // restar la parte de capital pagada y actualizar el préstamo.
        if (payment.getLoan() == null || payment.getLoan().getId() == null) {
            throw new RuntimeException("Pago debe estar asociado a un préstamo válido");
        }

        Long loanId = payment.getLoan().getId();
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado para aplicar pago"));

        BigDecimal amount = payment.getAmount() == null ? BigDecimal.ZERO : payment.getAmount();
        BigDecimal balance = loan.getBalance() == null ? loan.getPrincipalAmount() : loan.getBalance();
        BigDecimal annualRate = loan.getInterestRate() == null ? BigDecimal.ZERO : loan.getInterestRate();

        // tasa mensual (si interestRate está en porcentaje)
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);

        BigDecimal interest = balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal principalPaid = amount.subtract(interest);
        if (principalPaid.compareTo(BigDecimal.ZERO) < 0) {
            // El pago no alcanza a cubrir interés, solo aplicamos interés y no reducimos capital
            principalPaid = BigDecimal.ZERO;
        }

        BigDecimal newBalance = balance.subtract(principalPaid).setScale(2, RoundingMode.HALF_UP);
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) newBalance = BigDecimal.ZERO;

        loan.setBalance(newBalance);
        loan.setPaidInstallments((loan.getPaidInstallments() == null ? 0 : loan.getPaidInstallments()) + 1);
        if (newBalance.compareTo(BigDecimal.ZERO) == 0) loan.setStatus(Loan.LoanStatus.COMPLETED);

        loanRepository.save(loan);

        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
