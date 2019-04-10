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

const generate = (enabledTypes) => {

    const types = Object.entries(typeDefs)
    .filter(([type]) => enabledTypes.includes(type))
    .map(([type, props]) => Object.assign(props, {type}))

    const primitives = types.filter(({type}) => type !== 'SObject')
    const numbers = types.filter(({isNumeric}) => isNumeric)


    const code = `
    /* Code generated at https://alancnet.github.io/apex-x/ */
    public class X {
    ${types.map(({type}) => `
        public class ${type}Iterator implements Iterator<${type}> {
            private List<${type}[]> values;
            private Integer length;
            private Integer index;
            private Integer listIndex;
            private Integer listSize;
            private Integer subIndex;
            private ${type}[] currentList;
            public ${type}Iterator(List<${type}[]> values) {
                this.values = values;
                length = 0;
                for (${type}[] l : values) {
                    length += l.size();
                }
                this.index = 0;
                listIndex = 0;
                listSize = 0;
                subIndex = 0;
            }
            public Boolean hasNext() { return index < length; }
            public ${type} next() {
                if (subIndex >= listSize) {
                    currentList = values[listIndex++];
                    listSize = currentList.size();
                    subIndex = 0;
                    return next();
                }
                index++;
                return currentList[subIndex++];
            }
        }
        public class Of${type} implements Iterable<${type}> {
            public Iterator<${type}> iterator() { return new ${type}Iterator(values); }
            private List<${type}[]> values;
            private Of${type}(List<${type}[]> values) {
                if (values == null) this.values = new List<${type}[]>();
                else this.values = values;
            }
            public Of${type}() {
                this.values = new List<${type}[]>();
            }
            public Of${type}(${type}[] values) {
                if (values == null) this.values = new List<${type}[]>();
                else this.values = new List<${type}[]> { values };
            }
            public Of${type} filter(${type}Predicate predicate) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (predicate.apply(value)) ret.add(value);
                }
                return new Of${type}(ret);
            }
    ${types.map(({type:other}) => `
            public Of${other} mapTo(${type}To${other} mapper) {
                ${other}[] ret = new ${other}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    ret.add(mapper.apply(value));
                }
                return new Of${other}(ret);
            }
    ${type === 'SObject' ? `
            public Map<${other}, SObject> toMap(${other}Selector selector) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ret.put(selector.apply(value), value);
                }
                return ret;
            }
            public Map<${other}, SObject> toMapBy${other}(String field) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ret.put((${other})value.get(field), value);
                }
                return ret;
            }
            public Map<${other}, SObject> toMapBy${other}(Schema.SObjectField field) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ret.put((${other})value.get(field), value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy(${other}Selector selector) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})selector.apply(value);
                    if (!ret.containsKey(key)) ret.put(key, new ${type}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy${other}(Schema.SObjectField field) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})value.get(field);
                    if (!ret.containsKey(key)) ret.put(key, new ${type}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy${other}(String field) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})value.get(field);
                    if (!ret.containsKey(key)) ret.put(key, new ${type}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }

            public Of${other} pluck${other}(String field) {
                ${other}[] ret = new ${other}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    ret.add((${other})value.get(field));
                }
                return new Of${other}(ret);
            }
            public Of${other} pluck${other}(Schema.SObjectField field) {
                ${other}[] ret = new ${other}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    ret.add((${other})value.get(field));
                }
                return new Of${other}(ret);
            }

            public Of${type} having${other}(String field) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) != null) ret.add(obj);
                }
                return new Of${type}(ret);
            }
            public Of${type} having${other}(String field, ${other} value) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) == value) ret.add(obj);
                }
                return new Of${type}(ret);
            }
            public OfSObject having${other}(Schema.SObjectField field, ${other} value) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) == value) ret.add(obj);
                }
                return new Of${type}(ret);
            }
            public Of${type} notHaving${other}(String field) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) == null) ret.add(obj);
                }
                return new Of${type}(ret);
            }
            public Of${type} notHaving${other}(String field, ${other} value) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) != value) ret.add(obj);
                }
                return new Of${type}(ret);
            }
            public OfSObject notHaving${other}(Schema.SObjectField field, ${other} value) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} obj = iter.next();
                    if ((${other})obj.get(field) != value) ret.add(obj);
                }
                return new Of${type}(ret);
            }

    `:''}
    `).join('\n')}
            public ${type} reduce(${type}Reducer reducer) {
                ${type} accumulator;
                Integer length = size();
                Integer index = 0;
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (index++ == 0) {
                        accumulator = value;
                    } else {
                        accumulator = reducer.apply(accumulator, value);
                    }
                }
                return accumulator;
            }
            public Of${type} slice(Integer start, Integer finish) {
                if (start < 0) start = size() + start;
                if (finish < 0) finish = size() + finish;
                ${type}[] ret = new ${type}[0];
                for (${type}[] l : values) {
                    if (start > l.size()) {
                        start -= l.size();
                        finish -= l.size();
                        if (finish < 0) break;
                    } else {
                        for (Integer i = Math.max(0, start); i < finish && i < l.size(); i++) {
                            ret.add(l[i]);
                        }
                        start -= l.size();
                        finish -= l.size();
                    }
                }
                return new Of${type}(ret);
            }
            public Of${type} slice(Integer start) { return slice(start, size()); }
            public Of${type} distinct() { return new Of${type}(new List<${type}>(toSet())); }
            public Of${type} notNull() {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    if (value != null) ret.add(value);
                }
                return new Of${type}(ret);
            }
            public Of${type} without(${type} value) {
                ${type}[] ret = new ${type}[0];
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} v = iter.next();
                    if (v != value) ret.add(v);
                }
                return new Of${type}(ret);
            }
            public Integer size() {
                Integer length = 0;
                for (${type}[] l : values) {
                    length += l.size();
                }
                return length;
            }
            public Set<${type}> toSet() {
                Set<${type}> ret = new Set<${type}>();
                for (${type}[] l : values) {
                    ret.addAll(l);
                }
                return ret;
            }
            public List<${type}> toList() {
                ${type}[] ret = new ${type}[0];
                for (${type}[] l : values) {
                    ret.addAll(l);
                }
                return ret;
            }
            public List<${type}[]> getValues() { return values; }
            public ${type} first() { return get(0); }
            public ${type} last() { return get(size() - 1); }
            public String join(String separator) { return String.join(this, separator); }
            public String join() { return join(','); }
            public ${type} get(Integer index) {
                for (${type}[] l : values) {
                    if (index > l.size()) {
                        index -= l.size();
                    } else {
                        return l[index];
                    }
                }
                return null;
            }
            public Of${type} union(Of${type} other) { return union(other.values); }
            public Of${type} union(${type}[] other) { return union(new List<${type}[]> { other }); }
            private Of${type} union(List<${type}[]> other) {
                List<${type}[]> newList = new List<${type}[]>();
                newList.addAll(values);
                newList.addAll(other);
                return new Of${type}(newList);
            }
            public Of${type} add(${type} value) {
                if (values.size() == 0) values.add(new ${type}[0]);
                values[values.size() - 1].add(value);
                return this;
            }
            public Of${type} addAll(${type}[] other) { values.add(other); return this; }
            public Of${type} addAll(Set<${type}> other) { values[values.size() -1].addAll(other); return this; }

            public Of${type} remove(${type} value) {
                for (${type}[] l : values) {
                    for (Integer i = l.size() - 1; i >= 0; i--) {
                        if (l[i] == value) {
                            l.remove(i);
                        }
                    }
                }
                return this;
            }

    ${type === 'SObject' ? `
            public Map<Id, SObject> toMap() {
                Map<Id, SObject> ret = new Map<Id, SObject>();
                Iterator<${type}> iter = iterator();
                while (iter.hasNext()) {
                    ${type} value = iter.next();
                    ret.put(value.Id, value);
                }
                return ret;
            }
    ` : ''}

        }
        public static Of${type} of(${type}[] values) { return new Of${type}(values); }
        public static Of${type} of(Set<${type}> values) { return new Of${type}(new List<${type}>(values)); }
        public static Of${type} of(Of${type} values) { return values; }
        public interface ${type}Predicate { Boolean apply(${type} value); }
        public interface ${type}Reducer { ${type} apply(${type} a, ${type} b); }
        public interface ${type}Selector { ${type} apply(SObject value); }
        public interface ${type}Mapper extends X.${type}To${type} { }
    ${types.map(({type:other}) => `
        public interface ${type}To${other} { ${other} apply(${type} value); }
    `).join('')}
    `).join('')}
    ${primitives.map(({type}) => `
        public class ${type}MatchPredicate implements ${type}Predicate {
            private ${type} value;
            public ${type}MatchPredicate(${type} value) { this.value = value; }
            public Boolean apply(${type} value) { return this.value == value; }
        }
        public class SObjectByField${type}MatchPredicate implements SObjectPredicate {
            private ${type} value;
            private Schema.SObjectField field;
            public SObjectByField${type}MatchPredicate(Schema.SObjectField field, ${type} value) { this.field = field; this.value = value; }
            public Boolean apply(SObject value) { return this.value == (${type})value.get(this.field); }
        }
        public class SObjectByName${type}MatchPredicate implements SObjectPredicate {
            private ${type} value;
            private String field;
            public SObjectByName${type}MatchPredicate(String field, ${type} value) { this.field = field; this.value = value; }
            public Boolean apply(SObject value) { return this.value == (${type})value.get(this.field); }
        }
        public static ${type}MatchPredicate match(${type} value) { return new ${type}MatchPredicate(value); }
        public static SObjectByField${type}MatchPredicate match(Schema.SObjectField field, ${type} value) { return new SObjectByField${type}MatchPredicate(field, value); }
        public static SObjectByName${type}MatchPredicate match(String field, ${type} value) { return new SObjectByName${type}MatchPredicate(field, value); }
    `).join('')}
    }

    `

    const tests = `
    /* Code generated at https://alancnet.github.io/apex-x/ */
    @IsTest
    public class X_Tests {

        @isTest static void tests() {
            X.OfInteger ints = X.Of(new Integer[] {1,2,3});
            ints.addAll(new Integer[] {4,5});

            System.assertEquals('1,2,3,4,5', ints.join());
            System.assertEquals('2,3,4', ints.slice(1, -1).join());
            System.assertEquals(1, ints.first());
            System.assertEquals(5, ints.last());
            System.assertEquals(5, ints.size());
            System.assertEquals('1,2,4,5', ints.without(3).join());
            ints = ints.union(ints);
            System.assertEquals('1,2,3,4,5,1,2,3,4,5', ints.join());
            ints = ints.distinct();
            System.assertEquals('1,2,3,4,5', ints.join());
            ints.add(null);
            System.assertEquals('1,2,3,4,5,', ints.join());
            ints = ints.notNull().mapTo(new AddMapper(-3));
            System.assertEquals('-2,-1,0,1,2', ints.join());
            ints = ints.filter(new PositiveFilter());
            System.assertEquals('0,1,2', ints.join());
            ints.remove(1);
            System.assertEquals('0,2', ints.join());
        }
        private class AddMapper implements X.IntegerMapper {
            integer val;
            public AddMapper(Integer value) {
                this.val = value;
            }
            public Integer apply(Integer value) {
                return val + value;
            }
        }
        private class PositiveFilter implements X.IntegerPredicate {
            public Boolean apply(Integer value) {
                return value >= 0;
                }
        }

        @isTest
        public static void coverage() {
    ${types.map(({type, literal}) => `
          X.Of${type} a${type} = new X.Of${type}();
          a${type} = X.of(new ${type}[] { ${literal}, ${literal}, ${literal} });
          X.of(a${type}.toSet());
          X.of(a${type});
          a${type}.addAll(a${type}.toSet());
          a${type}.get(5);
          a${type}.get(50);
          a${type}.toList();
          a${type}.getValues();
          a${type}.slice(1);
          a${type}.slice(50);
          a${type}.slice(-1);
          a${type}.slice(1, -1);
          a${type}.slice(-1, 1);
          a${type}.size();
          a${type}.distinct();
          a${type}.notNull();
          a${type}.first();
          a${type}.last();
          a${type}.join();
          a${type}.without(a${type}.get(0));
          a${type}.slice(0).remove(a${type}.get(0));
          a${type}.union(new ${type}[0]);
          a${type}.union(a${type});
          X.Of${type} b${type} = a${type}.union(a${type});
          b${type}.add(${literal});
          b${type}.addAll(new ${type}[0]);
          b${type}.addAll(new Set<${type}>());
          a${type}.filter(new Test${type}Predicate());
          a${type}.reduce(new Test${type}Reducer());
    ${types.map(({type:other, literal:otherLiteral}) => `
          a${type}.mapTo(new Test${type}To${other}());
    `).join('')}
    `).join('')}
    ${types.map(({type, literal}) => `
          aSObject.pluck${type}('Name');
          aSObject.pluck${type}(Schema.Account.Name);
          aSObject.having${type}('Name');
          aSObject.having${type}('Name', ${literal});
          aSObject.having${type}(Schema.Account.Name, ${literal});
          aSObject.notHaving${type}('Name');
          aSObject.notHaving${type}('Name', ${literal});
          aSObject.notHaving${type}(Schema.Account.Name, ${literal});
          aSObject.groupBy${type}('Name');
          aSObject.groupBy${type}(Schema.Account.Name);
          aSObject.groupBy(new Test${type}Selector());
          aSObject.toMapBy${type}('Name');
          aSObject.toMapBy${type}(Schema.Account.Name);
          aSObject.toMap(new Test${type}Selector());
    `).join('')}
          aSObject.toMap();
        }
    ${types.flatMap(({type, literal}) => `
        private class Test${type}Predicate implements X.${type}Predicate { public Boolean apply(${type} value) { return true; }}
        private class Test${type}Reducer implements X.${type}Reducer { public ${type} apply(${type} a, ${type} b) { return a; }}
        private class Test${type}Selector implements X.${type}Selector { public ${type} apply(SObject value) { return ${literal}; }}
    `).join('')}
    ${types.flatMap(({type, literal}) => types.map(({type:other, literal:otherLiteral}) => `
        private class Test${type}To${other} implements X.${type}To${other} { public ${other} apply(${type} value) { return ${otherLiteral}; }}
    `)).join('')}
    }
    `
    return {
        code: code.split('\n').map(x => x.substr(4).trimEnd()).filter(x => x).join('\n'),
        tests: tests.split('\n').map(x => x.substr(4).trimEnd()).filter(x => x).join('\n')
    }
}
