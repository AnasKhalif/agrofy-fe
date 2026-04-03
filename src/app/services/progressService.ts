/**
 * ProgressService - Manages global loading state for API requests
 * Tracks active requests and provides subscribers with loading status
 */
class ProgressService {
  private activeRequests = 0;
  private subscribers: Set<(isLoading: boolean) => void> = new Set();

  /**
   * Subscribe to loading state changes
   * @param callback Function to call when loading state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (isLoading: boolean) => void): () => void {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.isLoading());

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Increment active request count
   */
  startRequest(): void {
    this.activeRequests++;
    this.notifySubscribers();
  }

  /**
   * Decrement active request count
   */
  endRequest(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    this.notifySubscribers();
  }

  /**
   * Check if any requests are active
   */
  isLoading(): boolean {
    return this.activeRequests > 0;
  }

  /**
   * Notify all subscribers of loading state change
   */
  private notifySubscribers(): void {
    const isLoading = this.isLoading();
    this.subscribers.forEach(callback => callback(isLoading));
  }

  /**
   * Reset all active requests (useful for cleanup)
   */
  reset(): void {
    this.activeRequests = 0;
    this.notifySubscribers();
  }
}

// Export singleton instance
export const progressService = new ProgressService();
