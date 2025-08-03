;; inspection-log.clar
;; Clarity v2

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NOT-OFFICER u101)
(define-constant ERR-ZERO-HASH u102)
(define-constant ERR-NOT-FOUND u103)
(define-constant ERR-PAUSED u104)

(define-constant CHECKLIST-ITEMS u5)

;; Admin
(define-data-var admin principal tx-sender)
(define-data-var paused bool false)

;; Officers (dummy certs in mock setup)
(define-map safety-officers principal bool)

;; Site registry: placeholder (in real setup, integrated with SiteRegistry)
(define-map sites (tuple (site-id uint)) bool)

;; Inspection struct
(define-map inspection-logs
  (tuple (site-id uint) (date uint))
  (tuple
    (officer principal)
    (checklist-complete bool)
    (file-hash (buff 48))
    (timestamp uint)
  )
)

;; === Utilities ===
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-private (is-officer)
  (default-to false (map-get? safety-officers tx-sender))
)

(define-private (ensure-not-paused)
  (asserts! (not (var-get paused)) (err ERR-PAUSED))
)

;; === Admin Functions ===

(define-public (add-officer (officer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set safety-officers officer true)
    (ok true)
  )
)

(define-public (remove-officer (officer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-delete safety-officers officer)
    (ok true)
  )
)

(define-public (set-paused (pause bool))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set paused pause)
    (ok pause)
  )
)

;; === Site Simulation (for testing purposes) ===
(define-public (register-site (site-id uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set sites { site-id: site-id } true)
    (ok true)
  )
)

;; === Core Functionality ===

(define-public (submit-inspection
  (site-id uint)
  (date uint)
  (checklist-complete bool)
  (file-hash (buff 48))
)
  (begin
    (ensure-not-paused)
    (asserts! (is-officer) (err ERR-NOT-OFFICER))
    (asserts! (not (is-eq file-hash (buff 48))) (err ERR-ZERO-HASH))
    (asserts! (is-some (map-get? sites { site-id: site-id })) (err ERR-NOT-FOUND))
    (map-set inspection-logs
      { site-id: site-id, date: date }
      {
        officer: tx-sender,
        checklist-complete: checklist-complete,
        file-hash: file-hash,
        timestamp: block-height
      }
    )
    (ok true)
  )
)

;; === Read-only ===

(define-read-only (get-inspection (site-id uint) (date uint))
  (match (map-get? inspection-logs { site-id: site-id, date: date })
    log (ok log)
    (err ERR-NOT-FOUND)
  )
)

(define-read-only (is-registered-site (site-id uint))
  (ok (default-to false (map-get? sites { site-id: site-id })))
)

(define-read-only (is-registered-officer (officer principal))
  (ok (default-to false (map-get? safety-officers officer)))
)

(define-read-only (is-paused)
  (ok (var-get paused))
)

(define-read-only (get-admin)
  (ok (var-get admin))
)
