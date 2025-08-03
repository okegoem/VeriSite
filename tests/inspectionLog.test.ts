import { describe, it, expect, beforeEach } from "vitest"

type LogKey = string;
type Principal = string;

interface InspectionEntry {
  officer: Principal;
  checklistComplete: boolean;
  fileHash: string;
  timestamp: number;
}

const mockContract = {
  admin: "ST1ADMIN123",
  paused: false,
  officers: new Set<Principal>(),
  sites: new Set<number>(),
  logs: new Map<LogKey, InspectionEntry>(),

  isAdmin(caller: Principal) {
    return caller === this.admin;
  },

  setPaused(caller: Principal, pause: boolean) {
    if (!this.isAdmin(caller)) return { error: 100 };
    this.paused = pause;
    return { value: pause };
  },

  addOfficer(caller: Principal, officer: Principal) {
    if (!this.isAdmin(caller)) return { error: 100 };
    this.officers.add(officer);
    return { value: true };
  },

  registerSite(caller: Principal, siteId: number) {
    if (!this.isAdmin(caller)) return { error: 100 };
    this.sites.add(siteId);
    return { value: true };
  },

  submitInspection(caller: Principal, siteId: number, date: number, checklistComplete: boolean, fileHash: string) {
    if (this.paused) return { error: 104 };
    if (!this.officers.has(caller)) return { error: 101 };
    if (!this.sites.has(siteId)) return { error: 103 };
    if (fileHash === "") return { error: 102 };

    const key = `${siteId}-${date}`;
    this.logs.set(key, {
      officer: caller,
      checklistComplete,
      fileHash,
      timestamp: 12345 // mock block height
    });
    return { value: true };
  },

  getInspection(siteId: number, date: number) {
    const key = `${siteId}-${date}`;
    const log = this.logs.get(key);
    if (!log) return { error: 103 };
    return { value: log };
  }
};

describe("InspectionLog Contract (Mock)", () => {
  const officer = "ST2INSPECTOR";
  const siteId = 42;
  const date = 20250803;
  const fileHash = "QmXyz123FakeHashHere==";

  beforeEach(() => {
    mockContract.paused = false;
    mockContract.sites.clear();
    mockContract.officers.clear();
    mockContract.logs.clear();
    mockContract.admin = "ST1ADMIN123";
  });

  it("should allow admin to register site", () => {
    const result = mockContract.registerSite("ST1ADMIN123", siteId);
    expect(result).toEqual({ value: true });
    expect(mockContract.sites.has(siteId)).toBe(true);
  });

  it("should add safety officer", () => {
    const result = mockContract.addOfficer("ST1ADMIN123", officer);
    expect(result).toEqual({ value: true });
    expect(mockContract.officers.has(officer)).toBe(true);
  });

  it("should submit a valid inspection", () => {
    mockContract.registerSite("ST1ADMIN123", siteId);
    mockContract.addOfficer("ST1ADMIN123", officer);

    const result = mockContract.submitInspection(officer, siteId, date, true, fileHash);
    expect(result).toEqual({ value: true });

    const inspection = mockContract.getInspection(siteId, date);
    expect(inspection.value?.fileHash).toBe(fileHash);
    expect(inspection.value?.checklistComplete).toBe(true);
  });

  it("should not submit if paused", () => {
    mockContract.setPaused("ST1ADMIN123", true);
    const result = mockContract.submitInspection(officer, siteId, date, true, fileHash);
    expect(result).toEqual({ error: 104 });
  });

  it("should not submit if not officer", () => {
    mockContract.registerSite("ST1ADMIN123", siteId);
    const result = mockContract.submitInspection("ST3RANDOM", siteId, date, true, fileHash);
    expect(result).toEqual({ error: 101 });
  });

  it("should not submit to unregistered site", () => {
    mockContract.addOfficer("ST1ADMIN123", officer);
    const result = mockContract.submitInspection(officer, 999, date, true, fileHash);
    expect(result).toEqual({ error: 103 });
  });

  it("should reject empty file hash", () => {
    mockContract.registerSite("ST1ADMIN123", siteId);
    mockContract.addOfficer("ST1ADMIN123", officer);
    const result = mockContract.submitInspection(officer, siteId, date, true, "");
    expect(result).toEqual({ error: 102 });
  });
});
