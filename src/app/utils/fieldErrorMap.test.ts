import { describe, it, expect } from 'vitest';
import { parseFieldErrors, groupFieldErrors, FIELD_ERROR_MAP } from './fieldErrorMap';
import type { BackendValidationErrorResponse } from '../types/auth';

describe('fieldErrorMap', () => {
  describe('parseFieldErrors', () => {
    it('parses normal field-prefix messages', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: ['password must contain at least one uppercase letter'],
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual({
        backendField: 'password',
        frontendField: 'password',
        message: 'must contain at least one uppercase letter',
      });
      expect(unmapped).toEqual([]);
    });

    it('parses "property {field} should not exist" messages', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: ['property roleId should not exist', 'property fullName should not exist'],
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual({
        backendField: 'roleId',
        frontendField: 'roleId',
        message: 'should not exist',
      });
      expect(unmapped).toEqual(['property fullName should not exist']);
    });

    it('treats unmapped backend fields as unmapped', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: ['unknownField is invalid'],
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(0);
      expect(unmapped).toEqual(['unknownField is invalid']);
    });

    it('handles empty message array', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: [],
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(0);
      expect(unmapped).toHaveLength(0);
    });

    it('handles mixed mapped, property-prefixed, and unmapped messages', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: [
          'password must contain at least one uppercase letter',
          'property roleId should not exist',
          'unknownField is invalid',
        ],
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(2);
      expect(parsed.map((p) => p.frontendField)).toEqual(['password', 'roleId']);
      expect(unmapped).toEqual(['unknownField is invalid']);
    });

    it('handles single string message (non-array)', () => {
      const response: BackendValidationErrorResponse = {
        statusCode: 400,
        message: 'firstName should not be empty',
        error: 'Bad Request',
      };
      const { parsed, unmapped } = parseFieldErrors(response);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].frontendField).toBe('firstName');
      expect(unmapped).toEqual([]);
    });
  });

  describe('groupFieldErrors', () => {
    it('groups multiple errors under the same frontend field', () => {
      const parsed = [
        { backendField: 'password', frontendField: 'password', message: 'too short' },
        { backendField: 'password', frontendField: 'password', message: 'needs uppercase' },
      ];
      const result = groupFieldErrors(parsed);
      expect(result).toEqual({
        password: ['too short', 'needs uppercase'],
      });
    });

    it('groups errors under different frontend fields', () => {
      const parsed = [
        { backendField: 'firstName', frontendField: 'firstName', message: 'required' },
        { backendField: 'lastName', frontendField: 'lastName', message: 'required' },
      ];
      const result = groupFieldErrors(parsed);
      expect(result).toEqual({
        firstName: ['required'],
        lastName: ['required'],
      });
    });
  });

  describe('FIELD_ERROR_MAP', () => {
    it('contains expected mappings aligned with post-020 RegistrationPage', () => {
      const fields = FIELD_ERROR_MAP.map((e) => e.backendField);
      expect(fields).toContain('firstName');
      expect(fields).toContain('lastName');
      expect(fields).toContain('email');
      expect(fields).toContain('password');
      expect(fields).toContain('companyName');
      expect(fields).toContain('roleId');
    });
  });
});
