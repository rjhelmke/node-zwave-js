/// <reference types="jest-extended" />
import { CommandClasses } from "../commandclass/CommandClass";
import { BasicDeviceClasses, GenericDeviceClasses } from "./DeviceClass";
import { parseNodeInformationFrame, parseNodeUpdatePayload } from "./NodeInfo";

describe("lib/node/NodeInfo", () => {
	describe("parseNodeInformationFrame()", () => {
		const payload = Buffer.from([
			GenericDeviceClasses["Remote Controller"],
			0x02, // Portable Scene Controller
			// Supported CCs
			CommandClasses["Multi Channel"],
			CommandClasses["Multilevel Toggle Switch"],
			0xEF, // ======
			// Controlled CCs
			CommandClasses["Multilevel Toggle Switch"],
		]);
		const eif = parseNodeInformationFrame(payload);

		it("should extract the correct GenericDeviceClass", () => {
			expect(eif.generic.name).toBe("Remote Controller");
		});

		it("should extract the correct SpecificDeviceClass", () => {
			expect(eif.specific.name).toBe("Portable Scene Controller");
		});

		it("should report the correct CCs as supported", () => {
			expect(eif.supportedCCs).toContainAllValues([
				CommandClasses["Multi Channel"],
				CommandClasses["Multilevel Toggle Switch"],
			]);
		});

		it("should report the correct CCs as controlled", () => {
			expect(eif.controlledCCs).toContainAllValues([
				CommandClasses["Multilevel Toggle Switch"],
			]);
		});
	});

	describe("parseNodeUpdatePayload()", () => {
		const payload = Buffer.from([
			5, // NodeID
			7, // Length (is ignored)
			BasicDeviceClasses.Slave,
			GenericDeviceClasses["Remote Controller"],
			0x02, // Portable Scene Controller
			// Supported CCs
			CommandClasses["Multi Channel"],
			CommandClasses["Multilevel Toggle Switch"],
			0xEF, // ======
			// Controlled CCs
			CommandClasses["Multilevel Toggle Switch"],
		]);
		const nup = parseNodeUpdatePayload(payload);

		it("should extract the correct node ID", () => {
			expect(nup.nodeId).toBe(5);
		});

		it("should extract the correct BasicDeviceClass", () => {
			expect(nup.basic).toBe(BasicDeviceClasses.Slave);
		});

		it("should extract the correct GenericDeviceClass", () => {
			expect(nup.generic.name).toBe("Remote Controller");
		});

		it("should extract the correct SpecificDeviceClass", () => {
			expect(nup.specific.name).toBe("Portable Scene Controller");
		});

		it("should report the correct CCs as supported", () => {
			expect(nup.supportedCCs).toContainAllValues([
				CommandClasses["Multi Channel"],
				CommandClasses["Multilevel Toggle Switch"],
			]);
		});

		it("should report the correct CCs as controlled", () => {
			expect(nup.controlledCCs).toContainAllValues([
				CommandClasses["Multilevel Toggle Switch"],
			]);
		});
	});

});
