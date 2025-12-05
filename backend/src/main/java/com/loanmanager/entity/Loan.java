package com.loanmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private BigDecimal principalAmount;

    @Column(nullable = false)
    private BigDecimal interestRate; // Porcentaje de interés

    @Column(nullable = false)
    private Integer numberOfInstallments; // Número de cuotas

    @Column(nullable = false)
    private BigDecimal monthlyInstallment; // Cuota mensual calculada

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance; // Saldo pendiente

    @Column(name = "paid_installments", nullable = false)
    private Integer paidInstallments;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LoanStatus status; // ACTIVE, COMPLETED, DEFAULTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        balance = principalAmount;
        paidInstallments = 0;
        status = LoanStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum LoanStatus {
        ACTIVE, COMPLETED, DEFAULTED
    }
}
