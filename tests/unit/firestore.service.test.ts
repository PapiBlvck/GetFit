import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FirestoreService } from '@services/firestore.service';

// Mock Firestore
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  addDoc: mockAddDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
}));

describe('FirestoreService', () => {
  let service: FirestoreService;
  const mockDb = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FirestoreService(mockDb);
  });

  describe('createDocument', () => {
    it('should create a document with auto-generated ID', async () => {
      const mockDocRef = { id: 'test-id-123' };
      mockAddDoc.mockResolvedValue(mockDocRef);
      mockCollection.mockReturnValue('meals-collection');

      const testData = {
        name: 'Test Meal',
        calories: 500,
      };

      const result = await service.createDocument('meals', testData);

      expect(mockCollection).toHaveBeenCalledWith(mockDb, 'meals');
      expect(mockAddDoc).toHaveBeenCalled();
      expect(result).toBe('test-id-123');
    });

    it('should handle creation errors', async () => {
      mockAddDoc.mockRejectedValue(new Error('Permission denied'));
      mockCollection.mockReturnValue('meals-collection');

      await expect(
        service.createDocument('meals', { name: 'Test' })
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('getDocument', () => {
    it('should retrieve an existing document', async () => {
      const mockData = { name: 'Test Meal', calories: 500 };
      const mockSnapshot = {
        exists: () => true,
        data: () => mockData,
        id: 'doc-123',
      };

      mockGetDoc.mockResolvedValue(mockSnapshot);
      mockDoc.mockReturnValue('doc-ref');
      mockCollection.mockReturnValue('collection-ref');

      const result = await service.getDocument('meals', 'doc-123');

      expect(result).toEqual({ id: 'doc-123', ...mockData });
    });

    it('should return null for non-existent document', async () => {
      const mockSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValue(mockSnapshot);
      mockDoc.mockReturnValue('doc-ref');
      mockCollection.mockReturnValue('collection-ref');

      const result = await service.getDocument('meals', 'non-existent');

      expect(result).toBeNull();
    });
  });

  describe('queryDocuments', () => {
    it('should query documents with filters', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Meal 1' }) },
        { id: '2', data: () => ({ name: 'Meal 2' }) },
      ];

      const mockQuerySnapshot = {
        docs: mockDocs,
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      mockQuery.mockReturnValue('query-ref');
      mockCollection.mockReturnValue('collection-ref');

      const conditions = [
        { field: 'userId', operator: '==' as const, value: 'user-123' },
      ];

      const result = await service.queryDocuments('meals', conditions);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', name: 'Meal 1' });
    });

    it('should handle empty query results', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);
      mockQuery.mockReturnValue('query-ref');
      mockCollection.mockReturnValue('collection-ref');

      const result = await service.queryDocuments('meals', []);

      expect(result).toEqual([]);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockDoc.mockReturnValue('doc-ref');
      mockCollection.mockReturnValue('collection-ref');

      const updates = { calories: 600 };

      await service.updateDocument('meals', 'doc-123', updates);

      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      mockDeleteDoc.mockResolvedValue(undefined);
      mockDoc.mockReturnValue('doc-ref');
      mockCollection.mockReturnValue('collection-ref');

      await service.deleteDocument('meals', 'doc-123');

      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});

