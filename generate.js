const typeDefs = {
  String:   {isNumeric: false, literal: "'foo'"},
  Integer:  {isNumeric: true,  literal: '123'},
  Decimal:  {isNumeric: true,  literal: '(Decimal)123.45'},
  Double:   {isNumeric: true,  literal: '(Double)123.45'},
  Long:     {isNumeric: true,  literal: '2147483648L' },
  // Date:     {isNumeric: false, },
  // DateTime: {isNumeric: false},
  Boolean:  {isNumeric: false, literal: 'true' },
  SObject:  {isNumeric: false, literal: 'new Account()'},
  Id:       {isNumeric: false, literal: "'00300000003T2PGAA0'"}
}

const types = Object.entries(typeDefs).map(([pascal, props]) => Object.assign(props, {pascal}))

let code = `
/* Code generated at https://codepen.io/alancnet/pen/MxYaWE */
public class X {
${types.map(({pascal}) => `
    public class Of${pascal} {
        private ${pascal}[] values;
        public Of${pascal}(${pascal}[] values) {
            if (values == null) this.values = new ${pascal}[0];
            else this.values = values;
        }
        public Of${pascal} filter(${pascal}Predicate predicate) {
            ${pascal}[] ret = new ${pascal}[0];
            for (${pascal} value : values) if (predicate.apply(value)) ret.add(value);
            return new Of${pascal}(ret);
        }
${types.map(({pascal:other}) => `
        public Of${other} mapTo(${pascal}To${other} mapper) {
            ${other}[] ret = new ${other}[0];
            for (${pascal} value : values) ret.add(mapper.apply(value));
            return new Of${other}(ret);
        }
${pascal === 'SObject' ? `
        public Map<${other}, SObject> toMap(${other}Selector selector) {
            Map<${other}, SObject> ret = new Map<${other}, SObject>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ret.put(selector.apply(value), value);
            }
            return ret;
        }
        public Map<${other}, SObject> toMapBy${other}(String field) {
            Map<${other}, SObject> ret = new Map<${other}, SObject>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ret.put((${other})value.get(field), value);
            }
            return ret;
        }
        public Map<${other}, SObject> toMapBy${other}(Schema.SObjectField field) {
            Map<${other}, SObject> ret = new Map<${other}, SObject>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ret.put((${other})value.get(field), value);
            }
            return ret;
        }
        public Map<${other}, SObject[]> groupBy(${other}Selector selector) {
            Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ${other} key = (${other})selector.apply(value);
                if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                ret.get(key).add(value);
            }
            return ret;
        }
        public Map<${other}, SObject[]> groupBy${other}(Schema.SObjectField field) {
            Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ${other} key = (${other})value.get(field);
                if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                ret.get(key).add(value);
            }
            return ret;
        }
        public Map<${other}, SObject[]> groupBy${other}(String field) {
            Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
            for (${pascal} value : values) {
                if (value == null) continue;
                ${other} key = (${other})value.get(field);
                if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                ret.get(key).add(value);
            }
            return ret;
        }

        public Of${other} pluck${other}(String field) {
            ${other}[] ret = new ${other}[0];
            for (${pascal} value : values) ret.add((${other})value.get(field));
            return new Of${other}(ret);
        }
        public Of${other} pluck${other}(Schema.SObjectField field) {
            ${other}[] ret = new ${other}[0];
            for (${pascal} value : values) ret.add((${other})value.get(field));
            return new Of${other}(ret);
        }
`:''}
`).join('\n')}
        public ${pascal} reduce(${pascal}Reducer reducer) {
            ${pascal} accumulator;
            if (values.size() == 0) accumulator = null;
            else accumulator = values[0];
            for (Integer i = 1; i < values.size(); i++) accumulator = reducer.apply(accumulator, values[i]);
            return accumulator;
        }
        public Of${pascal} slice(Integer start, Integer finish) {
            ${pascal}[] ret = new ${pascal}[0];
            for (Integer i = start; i < finish; i++) ret.add(values[i]);
            return new Of${pascal}(ret);
        }
        public Of${pascal} slice(Integer start) { return slice(start, values.size()); }
        public Of${pascal} distinct() { return new Of${pascal}(new List<${pascal}>(new Set<${pascal}>(values))); }
        public Of${pascal} notNull() {
            ${pascal}[] ret = new ${pascal}[0];
            for (${pascal} value : values) if (value != null) ret.add(value);
            return new Of${pascal}(ret);
        }
        public Integer size() { return values.size(); }
        public Set<${pascal}> toSet() { return new Set<${pascal}>(values); }
        public List<${pascal}> toList() { return new List<${pascal}>(values); }
        public List<${pascal}> getValues() { return values; }
        public ${pascal} first() { return get(0); }
        public ${pascal} last() { return get(size() - 1); }
        public ${pascal} get(Integer index) { return index >= 0 && index < size() ? values[index] : null; }
        public Of${pascal} union(Of${pascal} other) { return union(other.getValues()); }
        public Of${pascal} union(${pascal}[] other) {
            ${pascal}[] newList = new ${pascal}[0];
            newList.addAll(values);
            newList.addAll(other);
            return new Of${pascal}(newList);
        }
        public Of${pascal} add(${pascal} value) { values.add(value); return this; }
        public Of${pascal} addAll(${pascal}[] other) { values.addAll(other); return this; }
        public Of${pascal} addAll(Set<${pascal}> other) { values.addAll(other); return this; }

${pascal === 'SObject' ? `
        public Map<Id, SObject> toMap() {
            Map<Id, SObject> ret = new Map<Id, SObject>();
            for (${pascal} value : values) ret.put(value.Id, value);
            return ret;
        }
` : ''}

    }
    public static Of${pascal} of(${pascal}[] values) { return new Of${pascal}(values); }
    public static Of${pascal} of(Set<${pascal}> values) { return new Of${pascal}(new List<${pascal}>(values)); }
    public static Of${pascal} of(Of${pascal} values) { return values; }
    public interface ${pascal}Predicate { Boolean apply(${pascal} value); }
    public interface ${pascal}Reducer { ${pascal} apply(${pascal} a, ${pascal} b); }
    public interface ${pascal}Selector { ${pascal} apply(SObject value); }
${types.map(({pascal:other}) => `
    public interface ${pascal}To${other} { ${other} apply(${pascal} value); }
`).join('')}
`).join('')}
}
`.trim()
while (code.indexOf('\n\n') !== -1) code = code.split('\n\n').join('\n')
document.querySelector('#code').innerText = code


let tests = `
/* Code generated at https://codepen.io/alancnet/pen/MxYaWE */
@IsTest
public class X_Tests {
    @isTest
    public static void coverage() {
${types.map(({pascal, literal}) => `
      X.Of${pascal} a${pascal} = X.of(new ${pascal}[] { ${literal}, ${literal}, ${literal} });
      X.of(a${pascal}.toSet());
      X.of(a${pascal});
      a${pascal}.toList();
      a${pascal}.getValues();
      a${pascal}.slice(1);
      a${pascal}.size();
      a${pascal}.distinct();
      a${pascal}.notNull();
      a${pascal}.first();
      a${pascal}.last();
      X.Of${pascal} b${pascal} = a${pascal}.union(a${pascal});
      b${pascal}.add(${literal});
      b${pascal}.addAll(new ${pascal}[0]);
      b${pascal}.addAll(new Set<${pascal}>());
      a${pascal}.filter(new Test${pascal}Predicate());
      a${pascal}.reduce(new Test${pascal}Reducer());
${types.map(({pascal:other, literal:otherLiteral}) => `
      a${pascal}.mapTo(new Test${pascal}To${other}());
`).join('')}
`).join('')}
${types.map(({pascal, literal}) => `
      aSObject.pluck${pascal}('Name');
      aSObject.pluck${pascal}(Schema.Account.Name);
      aSObject.groupBy${pascal}('Name');
      aSObject.groupBy${pascal}(Schema.Account.Name);
      aSObject.groupBy(new Test${pascal}Selector());
      aSObject.toMapBy${pascal}('Name');
      aSObject.toMapBy${pascal}(Schema.Account.Name);
      aSObject.toMap(new Test${pascal}Selector());
`).join('')}
      aSObject.toMap();
    }
${types.flatMap(({pascal, literal}) => `
    private class Test${pascal}Predicate implements X.${pascal}Predicate { public Boolean apply(${pascal} value) { return true; }}
    private class Test${pascal}Reducer implements X.${pascal}Reducer { public ${pascal} apply(${pascal} a, ${pascal} b) { return a; }}
    private class Test${pascal}Selector implements X.${pascal}Selector { public ${pascal} apply(SObject value) { return ${literal}; }}
`).join('')}
${types.flatMap(({pascal, literal}) => types.map(({pascal:other, literal:otherLiteral}) => `
    private class Test${pascal}To${other} implements X.${pascal}To${other} { public ${other} apply(${pascal} value) { return ${otherLiteral}; }}
`)).join('')}
}
`.trim()
while (tests.indexOf('\n\n') !== -1) tests = tests.split('\n\n').join('\n')
document.querySelector('#test').innerText = tests
