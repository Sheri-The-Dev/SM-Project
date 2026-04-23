# Module 6 Impact & Integration Report

**Date:** 2026-04-20
**Focus:** Detailed Analysis of "Module 6: Smart Curriculum & Milestone Configuration" and its ripple effects across Modules 1 through 5.

---

## Part 1: What was built inside Module 6?

Module 6 introduces the concept of an **Academic Lifecycle and Batch Management system** to standardize how FYP-I and FYP-II operate. The following components have been fully created and integrated:

1. **Academic Batches (`academic_batches` table)**
   - Created separately to encapsulate student sessions. A batch has a specific `department`, `academic_year`, `fyp_phase`, and `state` (Draft, Active, Frozen, Archived). 
   - Batch Enrollment mechanism built explicitly via CSV upload (`curriculumController.enrollStudents`) that maps students accurately to these batches.
   - Intelligent transition mechanism from FYP-I to FYP-II (`transitionBatch`) that duplicates batches and migrates student statuses automatically.

2. **Milestone Tracks (`milestone_tracks` table)**
   - Smart templates tailored specifically per department and FYP phase. Allows admins and coordinators to pre-configure milestones.

3. **Weekly Tasks & Submissions (`weekly_tasks` & `task_submissions` tables)**
   - Configuration of weekly tasks linked to a track, complete with 'Template-Based' or 'Instruction-Only' capabilities. 
   - Deadline validation systems including global extensions (`batch_task_overrides`) and group-specific reopenings (`group_deadline_extensions`).
   - Task Submission logic scoped to an actively approved proposal so that documents are correctly correlated to groups.

4. **Compliance & Dashboards**
   - Built a master dashboard (`getComplianceDashboard`) to grant coordinators visibility over all groups' completion percentages.
   - Built supervisor dashboard (`getSupervisorGroupTasks`) to visualize progress of their assigned FYP groups.

---

## Part 2: Impact & Changes in Previous Modules (Modules 1-5)

Because Module 6 mandates that **everything must belong to a Batch**, critical architectural changes were injected into previously established modules to enforce data isolation and integrity.

### 🔄 Module 1: Authentication & User Account Management
- **Database level:** The `users` table was modified to include `batch_id` (foreign key) and `fyp_phase` (ENUM). 
- **User Creation/Enrollment:** User accounts are no longer "floating." When the coordinator uploads the Batch Enrollment CSV (handled separately in Module 6), it updates Module 1's `users` table directly to map them to the active batch.
- **Admin Statistics:** Admin metric queries were updated to ensure only students possessing a `batch_id` apply to active student counts dynamically.

### 🔄 Module 2: Profile & Personal Information Management
- **Profile Context Injection:** The user's specific `batch_id`, `fyp_phase`, and the `batch_name` are now intrinsically joined in profile fetching queries (`profileController.js`).
- **New Endpoints:** A new endpoint (`getMyBatch`) was created specifically for the student profile view, allowing the frontend to quickly fetch the state, start date, and track assigned to the student's active batch.

### 🔄 Module 3: Project Archive & Search
- **Lifecycle Transition (Archiving):** The system automatically deprecates an older batch (shifting its state to 'Archived') during the FYP-I to FYP-II transition.
- Currently, archive queries implicitly inherit phase divisions, though standard semantic search endpoints were mostly left untouched as they operate on finalized/historical structures.

### 🔄 Module 4: Proposal Management (Heavy Impact)
- **Database Level:** The `proposals` table was altered extensively to include a `batch_id` column. 
- **Strict Scope Validation:** 
  - Students can no longer submit a proposal if their `batch_id` does not point to an "Active" batch. (`proposalController.js:100`).
  - During proposal creation, the `batch_id` is automatically injected into the new record preventing orphaned proposals.
- **Data Isolation:** All retrieval endpoints like `getMyProposals` filter specifically using `WHERE p.batch_id = ?`, completely eradicating the risk of cross-batch data bleeding (e.g. picking up proposals from last year).

### 🔄 Module 5: Supervision Management
- **Workload Scoping:** Supervisor capacity tracking initially calculated a global count. The introduction of batches meant supervision quotas needed a reset mechanism. 
- **FYP-I to FYP-II Resets:** A major change injected into Supervision logic is that upon transitioning an active batch to FYP-II, a mass-update is executed on the `users` table to reset workloads (`current_supervisees = 0`) for the new session, allowing fresh topic/capacity assignments to commence for the new term.

---

**Summary:** The integration of Module 6 reshaped the core hierarchy. Instead of Students and Proposals floating loosely in the system, they are now strictly wrapped within "Batches." This required systemic changes predominantly affecting User Management (Module 1/2) and Proposal Submissions (Module 4), converting the system from an open-loop into a context-locked, trackable lifecycle.
