# VeriSite

A blockchain-powered construction safety and compliance ledger designed to protect workers, enforce regulations, and ensure transparent reporting of on-site incidents — all on-chain.

---

## Overview

VeriSite consists of ten modular Clarity smart contracts that work together to create a decentralized safety infrastructure for construction projects:

1. **SiteRegistry** – Registers and tracks construction site metadata.
2. **SafetyOfficerRegistry** – Verifies certified safety officers and their assignments.
3. **InspectionLog** – Records daily inspection checklists and supporting files.
4. **IncidentReport** – Enables transparent and optionally anonymous incident logging.
5. **ViolationEscalator** – Automatically triggers warnings or penalties based on violation history.
6. **WorkerAnonBox** – Privacy-preserving mechanism for whistleblower reporting.
7. **ComplianceAuditTrail** – Creates an immutable audit trail for regulatory review.
8. **ReputationLedger** – Tracks safety reputation scores for sites and contractors.
9. **InsuranceOracleInterface** – Interfaces with insurers to adjust premiums based on safety data.
10. **PenaltyVault** – Holds and distributes penalty funds for non-compliance.

---

## Features

- **Immutable safety records** for inspections and incidents  
- **Automated violation escalation** and enforcement  
- **Anonymous whistleblower reporting** with worker protection  
- **Transparent contractor reputation scores**  
- **Penalty and deposit management** tied to contract behavior  
- **Real-time access** for regulators and insurers  
- **On-chain audit trail** for external oversight  

---

## Smart Contracts

### SiteRegistry
- Register a new construction site
- Store contractor, location, and permit metadata
- Link site to active smart modules

### SafetyOfficerRegistry
- Verify and onboard certified safety officers
- Assign officers to specific sites
- Track officer actions and inspections

### InspectionLog
- Submit daily/weekly inspection entries
- Attach IPFS or hash references to photo/video proof
- Validate minimum checklist requirements

### IncidentReport
- Log safety incidents or near misses
- Allow anonymous reporting by verified workers
- Timestamp and record all entries immutably

### ViolationEscalator
- Monitor logs for repeated or critical violations
- Automatically trigger status flags, audits, or pause notices
- Interface with PenaltyVault for automatic deductions

### WorkerAnonBox
- Accept zero-knowledge or shielded identity submissions
- Route reports to the correct site and officer
- Prevent retaliation or manipulation

### ComplianceAuditTrail
- Store hash references to all submitted files and reports
- Enable authorized regulators to verify proof-of-inspection
- Maintain complete historical logs

### ReputationLedger
- Assign safety scores to contractors and individual sites
- Factor in incident frequency, inspection quality, and responsiveness
- Make scores publicly queryable on-chain

### InsuranceOracleInterface (optional)
- Communicate verified scores or events to off-chain insurer APIs
- Enable dynamic premium adjustments or coverage limits

### PenaltyVault
- Require contractors to deposit a penalty bond
- Automatically deduct fines based on violation triggers
- Allow appeals or return of unused bond on project completion

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/verisite.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

---

## License

MIT License