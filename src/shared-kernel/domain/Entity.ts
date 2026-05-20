export abstract class Entity<TId, TProps extends object> {
  readonly id: TId;
  protected props: TProps;

  protected constructor(id: TId, props: TProps) {
    this.id = id;
    this.props = props;
  }

  equals(other: Entity<TId, TProps> | null | undefined): boolean {
    if (other === null || other === undefined) return false;
    if (other === this) return true;
    if (other.constructor !== this.constructor) return false;
    return this.id === other.id;
  }
}
